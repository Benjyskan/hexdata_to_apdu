import { ethers } from 'ethers'

// maybe use SPECULOS_ADDRESS to sign
const SPECULOS_ADDRESS = '0xFE984369CE3919AA7BB4F431082D027B4F8ED70C';

function getSeralizedTx(data: string, contractAddr: string, chainID: number = 1) {
	let unsignedTx = {
		nonce: Number(0),
		gasLimit: Number(21000),
		gasPrice: ethers.utils.parseUnits('1', 'gwei'),
		value: ethers.utils.parseEther('0.1'),
		chainId: chainID,
		to: contractAddr,
		data: data,
		// type: 2,
		// maxFeePerGas: ethers.utils.parseUnits('1', 'gwei'),
	};
	let serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);

	//remove txType from serializedTx
	const txType = serializedTx.slice(0, 2)
	if (txType == '01' || txType == '02')
		serializedTx = serializedTx.slice(2)
	return serializedTx
}

function getHexLen(line: string) {
	let hexLen = (line.length / 2).toString(16)
	if (hexLen.length < 2) hexLen = '0' + hexLen
	return hexLen.toUpperCase()
}

export { getSeralizedTx, getHexLen }