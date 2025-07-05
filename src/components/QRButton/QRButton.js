import React from "react";
import QRButtonEng from "oREChain-qr-button";
import { Trans, useTranslation } from 'react-i18next';

export const QRButton = React.forwardRef(({config={}, ...props}, ref) => {
  const { t } = useTranslation();
  return <QRButtonEng ref={ref} {...props} config={
    {
      title: <Trans i18nKey="qr_button.title"><span>Scan this QR code <br /> with your mobile phone</span></Trans>,
      downloadTitle: t("qr_button.download_title", "Download OREChain wallet"),
      tooltip: t("qr_button.tooltip", "This will open your OREChain wallet installed on this computer and send the transaction"),
      tooltipMobile: t("qr_button.tooltip_mob", "Send the transaction from your mobile phone"),
      install: t("qr_button.install", "Install OREChain wallet for [ios] or [android] if you don't have one yet"),
      oREChainIn: t("qr_button.oREChain_in", "OREChain in"),
      ...config
    }
  } />;
});