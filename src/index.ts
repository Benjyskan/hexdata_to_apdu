import { getSeralizedTx, getHexLen } from './utils.js'
let DBG = false
const PLACE_HOLDER_SIGNATURE = "3045022100f6e1a922c745e244fa3ed9a865491672808ef93f492ee0410861d748c5de201f0220160d6522499f3a84fa3e744b3b81e49e129e997b28495e58671a1169b16fa777";

// Look for --debug
const dbg_index = process.argv.findIndex((param, index) => param == '--debug')
if (dbg_index != -1) {
	process.argv.splice(dbg_index, 1)
	DBG = true
}

// Print usage
if (process.argv.length != 5) {
	console.warn("usage: chainID contractAddress txData [--debug]")
	process.exit(0)
}

// Get args
const chainID = parseInt(process.argv[2])
const contractAddr = process.argv[3]
const hexData = process.argv[4]

// Serialize
DBG && console.log("hexData:", hexData)
let serializedTx = getSeralizedTx(hexData, contractAddr, chainID)
DBG && console.log("serializedTx :", serializedTx)

// Get first apdu
const first_apdu_length = 258
const first_apdu = serializedTx.slice(0, first_apdu_length)
DBG && console.log("first apdu", first_apdu)

// Remove first apdu
serializedTx = serializedTx.slice(first_apdu_length)
// serializedTx = serializedTx.slice(266)

// print in parameters style
DBG && console.error('parameters:', serializedTx.slice(0).match(/.{1,64}/g))

// Split tx into apdu sized chunk
const hexArray = serializedTx.slice(0).match(/.{1,300}/g)
DBG && console.log("hexArray:", hexArray)

// Put back first apdu
hexArray.unshift(first_apdu)

DBG && console.log("APDU:")
hexArray.forEach((elem, index) => {
	// unkwown 58 and last zeros in 058000002C8000003C800000000000000000000000 !!!
	// hexArray[index] = 'E0040000' + getHexLen(elem) + '048000002C8000003C8000000000000000' + first_apdu.toUpperCase()
	if (index == 0) {
		const line = '058000002C8000003C800000000000000000000000' + elem.toUpperCase()
		hexArray[index] = 'E0040000' + getHexLen(line) + line
		// hexArray[index] = 'E0040000' + '96' + '058000002C8000003C800000000000000000000000' + elem.toUpperCase()
		// hexArray[index] = 'E0040000' + getHexLen(elem) + '058000002C8000003C800000000000000000000000' + first_apdu.toUpperCase()
	}
	else // last index
		hexArray[index] = 'E0048000' + getHexLen(elem) + elem.toUpperCase()
	console.log(hexArray[index])
})
console.log('+')