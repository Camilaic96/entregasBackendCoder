class ProductDTO {
	constructor(product) {
		this._id = product._id;
		this.title = product.title;
		this.description = product.description;
		this.code = product.code;
		this.price = product.price;
		this.stock = product.stock;
		this.status = product.status;
		this.category = product.category;
		this.thumbnails = product.thumbnails;
	}
}

module.exports = ProductDTO;
