const networks = {
	"0x1": "Mainnet",
	"0x3": "Ropsten",
	"0x2a": "Kovan",
	"0x4": "Rinkeby",
	"0x5": "Goerli",
	"0xaa36a7": "Sepolia",
	"0x61": "BSC Testnet",
	"0x38": "BSC Mainnet",
	"0x89": "Polygon Mainnet",
	"0x13881": "Polygon Mumbai Testnet",
	"0xa86a": "AVAX Mainnet",
};
      
// Add index signature to the networks object
const networksWithIndexSignature = networks;
networksWithIndexSignature['[key: string]'] = '';
      
export { networksWithIndexSignature as networks };