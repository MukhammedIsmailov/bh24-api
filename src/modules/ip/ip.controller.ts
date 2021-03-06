import * as axios from 'axios';

export class IpController {
    static async getGeoByIp (ctx, next) {
        try {
            const ip = ctx.request.ip.replace('::ffff:', '');
            const resp = await axios.default.get(`https://ipapi.co/${ip}/country/`);
            const country = resp.data;
            ctx.response.body = { country };
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
        await next();
    }

}
