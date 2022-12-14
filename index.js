require('dotenv').config();

const { DnsManagementClient } = require("@azure/arm-dns");
const { DefaultAzureCredential } = require("@azure/identity");

const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function getPublicIP() {
    const { stdout, stderr } = await exec("nslookup myip.opendns.com resolver1.opendns.com");
    // From the string in stdout, extract the fifth line splitting by end of line, and then extract the IP address from that line.
    const ip = stdout.split("\n")[4].split(" ")[2].split("\r")[0];
    return ip;
}

(async () => {
    let ipAddress;
    try {
        ipAddress = await getPublicIP();
    } catch (err) {
        console.log('Error', err);
    }

    // Check if the file ip.txt exists using async/await
    const fs = require('fs');
    const util = require('util');
    const readFile = util.promisify(fs.readFile);

    let ipFile;
    try {
        ipFile = await readFile('./ip.txt', 'utf8');
    } catch (err) {
        console.log('Error', err);
    }

    if (ipFile === ipAddress) {
        console.log("IP address is the same, no need to update it.");
        return;
    }

    // Write the IP address to the ip.txt file
    const writeFile = util.promisify(fs.writeFile);
    try {
        await writeFile('./ip.txt', ipAddress);
    } catch (err) {
        console.log('Error', err);
    }

    try {
        await createARecordset(ipAddress);
    } catch (err) {
        console.log('Error', err);
    }
})();

/**
 * This sample demonstrates how to Creates or updates a record set within a DNS zone.
 *
 * @summary Creates or updates a record set within a DNS zone.
 * x-ms-original-file: specification/dns/resource-manager/Microsoft.Network/stable/2018-05-01/examples/CreateOrUpdateARecordset.json
 */
async function createARecordset(ip) {
  const subscriptionId = process.env.SUBSCRIPTION_ID;
  const resourceGroupName = process.env.RESOURCE_GROUP_NAME;
  const zoneName = process.env.ZONE_NAME;
  const relativeRecordSetName = process.env.RELATIVE_RECORD_SET_NAME;
  const recordType = "A";
  const parameters = {
    aRecords: [{ ipv4Address: ip }],
    ttl: 3600,
  };
  const credential = new DefaultAzureCredential();
  const client = new DnsManagementClient(credential, subscriptionId);
  const result = await client.recordSets.createOrUpdate(
    resourceGroupName,
    zoneName,
    relativeRecordSetName,
    recordType,
    parameters
  );
  console.log(result);
}
