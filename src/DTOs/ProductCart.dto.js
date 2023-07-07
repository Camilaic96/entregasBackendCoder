class ProductCartDTO {
	constructor(item) {
		this.id = item.product._id;
		this.title = item.product.title;
		this.description = item.product.description;
		this.price = item.product.price;
		this.stock = item.product.stock;
		this.quantity = item.quantity;
		this.total = item.quantity * item.product.price;
	}
}

module.exports = ProductCartDTO;
