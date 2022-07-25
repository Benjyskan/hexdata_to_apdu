const pluginName = 'Nested'
const contractAddress = '0x0fff7f99d2b32849848e31cb48090c5268e06f65'
const selector = '0xbba9b10c'

function serialize_data(pluginName, contractAddress, selector) {
	const len = Buffer.from([pluginName.length]);
	const name = Buffer.from(pluginName)
	const address = Buffer.from(contractAddress.slice(2), "hex");
	const methodid = Buffer.from(selector.slice(2), "hex");

	return Buffer.concat([len, name, address, methodid]);
}

console.log(serialize_data(pluginName, contractAddress, selector))