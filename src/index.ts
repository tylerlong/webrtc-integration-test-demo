import WebPhone from 'ringcentral-web-phone';
import RingCentral from '@rc-ex/core';
import localforage from 'localforage';
import type SipInfoResponse from '@rc-ex/core/lib/definitions/SipInfoResponse';

const main = async () => {
  const cookieKey = 'webrtc-integration-test-demo-cookie';
  let sipInfo = await localforage.getItem<SipInfoResponse>(cookieKey);
  if (sipInfo === null) {
    console.log('generate new sipInfo');
    const rc = new RingCentral({
      server: process.env.RINGCENTRAL_SERVER_URL,
      clientId: process.env.RINGCENTRAL_CLIENT_ID,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
    });
    await rc.authorize({
      jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
    });
    const r = await rc
      .restapi()
      .clientInfo()
      .sipProvision()
      .post({
        sipInfo: [{ transport: 'WSS' }],
      });
    sipInfo = r.sipInfo![0];
    await localforage.setItem(cookieKey, sipInfo);
  } else {
    console.log('use existing sipInfo');
  }
  console.log(sipInfo);
  const webPhone = new WebPhone({ sipInfo });
  await webPhone.enableDebugMode();
  await webPhone.register();
};
main();
