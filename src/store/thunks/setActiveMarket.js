import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

import backend from "services/backend";
import oREChain from "services/oREChain";
import http from "services/http";

import { setActiveMarketAddress } from "store/slices/activeSlice";
import { saveBaseOHLC } from "store/slices/settingsSlice";

import appConfig from "appConfig";

const initialParams = {
  allow_draw: false,
  comparison: '==',
  reserve_asset: 'base',
  waiting_period_length: 5 * 24 * 3600,
  issue_fee: 0.01,
  redeem_fee: 0.02,
  arb_profit_tax: 0.9,
  datafeed_draw_value: 'none'
};

export const setActiveMarket = createAsyncThunk(
  'setActiveMarket',
  async ({ address }, { dispatch, getState }) => {
    dispatch(setActiveMarketAddress(address))
    const state = getState();

    const [aa, stateVars] = await Promise.all([
      http.getDefinition(address),
      http.getStateVars(address)
    ])


    const base_aa = aa[1].base_aa;
    const reserve_asset = aa[1].params.reserve_asset || 'base';

    if (!appConfig.BASE_AAS.includes(base_aa)) throw new Error("unknown base aa");

    const tokenRegistry = oREChain.api.getOfficialTokenRegistryAddress();

    const tokensInfo = {};

    let tokensInfoGetters = [
      http.getSymbolByAsset(tokenRegistry, stateVars.yes_asset).then(symbol => tokensInfo.yes_symbol = symbol),
      http.getSymbolByAsset(tokenRegistry, stateVars.no_asset).then(symbol => tokensInfo.no_symbol = symbol),
      http.getSymbolByAsset(tokenRegistry, reserve_asset).then(symbol => tokensInfo.reserve_symbol = symbol),
      http.getDecimalsBySymbolOrAsset(tokenRegistry, stateVars.yes_asset).then(decimals => tokensInfo.yes_decimals = decimals).catch(() => tokensInfo.yes_decimals = null),
      http.getDecimalsBySymbolOrAsset(tokenRegistry, stateVars.no_asset).then(decimals => tokensInfo.no_decimals = decimals).catch(() => tokensInfo.no_decimals = null),
      http.getDecimalsBySymbolOrAsset(tokenRegistry, reserve_asset).then(decimals => tokensInfo.reserve_decimals = decimals).catch(() => tokensInfo.reserve_decimals = null),
    ]

    if (aa[1].params.allow_draw && stateVars.draw_asset) {
      tokensInfoGetters.push(
        http.getSymbolByAsset(tokenRegistry, stateVars.draw_asset).then(symbol => tokensInfo.draw_symbol = symbol),
        http.getDecimalsBySymbolOrAsset(tokenRegistry, stateVars.draw_asset).then(decimals => tokensInfo.draw_decimals = decimals).catch(() => tokensInfo.draw_decimals = 0)
      );
    }

    await Promise.all(tokensInfoGetters);

    const params = { ...initialParams, ...aa[1].params, ...tokensInfo };

    if (!params.yes_decimals) params.yes_decimals = params.reserve_decimals;
    if (!params.no_decimals) params.no_decimals = params.reserve_decimals;
    if (!params.draw_decimals) params.draw_decimals = params.reserve_decimals;

    const [dailyCandles, { data: recentEvents, count: recentEventsCount }, datafeedValue] = await Promise.all([
      backend.getDailyCandles(address).then((data) => data).catch(() => []),
      backend.getRecentEvents(address),
      http.getDataFeed([params.oracle], params.feed_name, 'none'),
      oREChain.justsaying("light/new_aa_to_watch", {
        aa: address
      })
    ]);


    const isSportMarket = !!appConfig.CATEGORIES.sport.oracles.find(({ address }) => address === params.oracle);
    const isCurrencyMarket = !!appConfig.CATEGORIES.currency.oracles.find(({ address }) => address === params.oracle);

    const isHourlyChart = params.event_date + params.waiting_period_length - moment.utc().unix() <= 7 * 24 * 3600;

    let yesTeam;
    let noTeam;
    let currencyCandles = [];
    let currencyCurrentValue = 0;
    let league_emblem = null;
    let league = null;

    let yes_odds = null;
    let no_odds = null;
    let draw_odds = null;
    let yes_crest_url = null;
    let no_crest_url = null;

    const dates = await backend.getDates(address);

    const created_at = dates.created_at;
    const committed_at = dates.committed_at;
    const first_trade_ts = await backend.getFirstTradeTs(address);


    if (isSportMarket) {

      if (!yes_odds || !no_odds || !draw_odds) {
        const odds = await backend.getBookmakerOdds('soccer', params.feed_name);

        if (odds) {
          yes_odds = odds.yes_odds;
          no_odds = odds.no_odds;
          draw_odds = odds.draw_odds;
        }
      }

      const [championship, yes_abbreviation, no_abbreviation] = params.feed_name.split("_");
      const championships = await backend.getChampionships();

      const sport = Object.entries(championships).find(([_, cs]) => cs.find(({ code }) => code === championship));

      if (sport) {
        const championshipData = championships[sport[0]].find(({ code }) => code === championship);
        league_emblem = championshipData?.emblem;
        league = championshipData?.name;

        try {
          [yesTeam, noTeam] = await Promise.all([
            backend.getTeam(sport[0], yes_abbreviation),
            backend.getTeam(sport[0], no_abbreviation)
          ]);

          [yes_crest_url, no_crest_url] = await Promise.all([
            backend.getCrest(sport[0], championship, yesTeam.id),
            backend.getCrest(sport[0], championship, noTeam.id)
          ]);
        } catch (e) {
          console.error('error get teams id');
        }
      }
    } else if (isCurrencyMarket) {
      const [from, to] = params.feed_name.split("_");
      const toTsQueryParam = committed_at ? `&toTs=${committed_at}` : '';
      const now = moment.utc().unix();

      try {
        if (from === 'GREChain' && params.event_date > now) {
          if ((state.settings?.baseOHLC?.expireTs || 0) > Math.floor(Date.now() / 1000)) {
            currencyCandles = state.settings?.baseOHLC?.data || [];
          } else {
            const ohlc = await axios.get(`https://api.coingecko.com/api/v3/coins/REChainball/ohlc?vs_currency=usd&days=30`, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS"
              }
            }).then(({ data }) => data.map(([ts, o, h, l, c]) => ({ time: ts / 1000, open: o, high: h, low: l, close: c })));

            dispatch(saveBaseOHLC(ohlc));

            currencyCandles = ohlc;
          }

          currencyCurrentValue = await axios.get(`https://api.coingecko.com/api/v3/coins/REChainball`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS"
            }
          }).then(({ data }) => data?.market_data?.current_price?.usd);

        } else {
          const cryptocompare = await Promise.all([
            axios.get(`https://min-api.cryptocompare.com/data/v2/${isHourlyChart ? 'histohour' : 'histoday'}?fsym=${from}&tsym=${to}${toTsQueryParam}&limit=${isHourlyChart ? 168 : 30}`).then(({ data }) => data?.Data?.Data),
            axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`).then(({ data }) => data?.[to])
          ]);

          currencyCandles = cryptocompare[0];
          currencyCurrentValue = cryptocompare[1];
        }
      } catch {
        console.log(`no candles for ${from}->${to}`)
      }
    }

    return {
      params,
      stateVars,
      base_aa,
      dailyCandles,
      recentEvents,
      recentEventsCount,
      datafeedValue: datafeedValue !== 'none' ? datafeedValue : null,
      yesTeam,
      noTeam,
      currencyCandles,
      currencyCurrentValue,
      created_at,
      committed_at,
      first_trade_ts,
      yes_odds,
      no_odds,
      draw_odds,
      yes_crest_url,
      no_crest_url,
      league: {
        league_emblem,
        league
      }
    }
  })