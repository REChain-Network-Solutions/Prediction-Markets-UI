import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "services/oREChain";

export const loadUserBalance = createAsyncThunk(
  'loadUserBalance',
  async (walletAddress) => {
    const balance = await client.api.getBalances([walletAddress]).then((b) => b?.[walletAddress]);

    return ({
        address: walletAddress,
        balance
    })
  }
)