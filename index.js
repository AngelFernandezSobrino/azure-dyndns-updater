import * as dotenv from 'dotenv';
dotenv.config();

import nslookup from 'nslookup';

import * as fs from 'fs';
import util from 'util';
import process from 'process';

import { DnsManagementClient } from '@azure/arm-dns';
import { DefaultAzureCredential } from '@azure/identity';

import { publicIpv4 } from 'public-ip';

(async () => {

  const ipAddress = await publicIpv4({
    fallbackUrls: [
      'https://ifconfig.co/ip',
      'https://api.ipify.org',
    ],
    onlyHttps: true
  });

  // Check if the file ip.txt exists using async/await

  const readFile = util.promisify(fs.readFile);

  let ipFile;
  try {
    ipFile = await readFile('./ip.txt', 'utf8');
  } catch (err) {
    //console.log('Error', err);
  }

  if (ipFile === ipAddress) {
    //console.log('IP address is the same, no need to update it.');

    // Here we need to check if the 
    //
    // console.log('Check that ip address on server is correct')
    try {
      const authoritativeNameServers = await new Promise((resolve, reject) => {
        nslookup(process.env.ZONE_NAME).type('ns').end((err, data) => {
          // console.log(data);
          if (err) reject(err);
          else resolve(data);
        })
      })

      const authoritativeNameServerAddress = await new Promise((resolve, reject) => {
        nslookup(authoritativeNameServers[0]).type('a').end((err, data) => {
          // console.log(data);
          if (err) reject(err);
          else resolve(data);
        })
      })

      const hostAddressOnAuthoritativeServer = await new Promise((resolve, reject) => {
        
        nslookup(`${process.env.RELATIVE_RECORD_SET_NAME}.${process.env.ZONE_NAME}`).server(authoritativeNameServerAddress[0]).end((err, data) => {
          // console.log(data);
          if (err) reject(err);
          else resolve(data);
        })
      })

      if (hostAddressOnAuthoritativeServer[0] === ipAddress) {
        console.log('IP updated on server');
        return;
      } else {
        console.log('IP not updated, trying to update');
      }

    } catch (err) {
      //console.log(err);
    }

  }

  // Write the IP address to the ip.txt file
  const writeFile = util.promisify(fs.writeFile);
  try {
    await writeFile('./ip.txt', ipAddress);
  } catch (err) {
    //console.log('Error', err);
  }

  try {
    await createARecordset(ipAddress);
  } catch (err) {
    //console.log('Error', err);
  }
})();

/**
 * This sample demonstrates how to Creates or updates a record set within a DNS zone.
 *
 * @summary Creates or updates a record set within a DNS zone.
 * x-ms-original-file: specification/dns/resource-manager/Microsoft.Network/stable/2018-05-01/examples/CreateOrUpdateARecordset.json
 */
async function createARecordset(ip) {
  console.log('Creating record set');
	const subscriptionId = process.env.SUBSCRIPTION_ID;
  const resourceGroupName = process.env.RESOURCE_GROUP_NAME;
  const zoneName = process.env.ZONE_NAME;
  const relativeRecordSetName = process.env.RELATIVE_RECORD_SET_NAME;
  const recordType = 'A';
  const parameters = {
    aRecords: [{ ipv4Address: ip }],
    ttl: 300,
  };
  const credential = new DefaultAzureCredential();
  const client = new DnsManagementClient(credential, subscriptionId);
  // console.log(client);x  
  try {
	const result = await client.recordSets.createOrUpdate(
    resourceGroupName,
    zoneName,
    relativeRecordSetName,
    recordType,
    parameters
  );
	  console.log(result);
  } catch (e) {
	console.log(e);
  }
}
