//-----------------------------------------------------------------------------
// common routines
//-----------------------------------------------------------------------------
'use strict';

import vpk from '../lib/vpk.js';

import { logMessage } from '../utils/logging.js';
export function buildVolumeAttachmentInfo(volAtt) {
    volAtt = {};
    try {
        logMessage('AFT202 - Processing VolmueAttachments information');
        let keys: string[] = Object.keys(vpk.volumeAttachment);
        for (let k: number = 0; k < keys.length; k++) {
            volAtt[vpk.volumeAttachment[keys[k]][0].nodeName + '::' + vpk.volumeAttachment[keys[k]][0].attacher] = {
                fnum: vpk.volumeAttachment[keys[k]][0].fnum,
                pvName: vpk.volumeAttachment[keys[k]][0].pvName,
                name: vpk.volumeAttachment[keys[k]][0].name,
            };
        }
    } catch (err) {
        logMessage('AFT002 - Error processing volumeAttachmentRelated, message: ' + err);
        logMessage('AFT002 - Stack: ' + err.stack);
    }
}
