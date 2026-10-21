const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

//  Existing inventory
const products = [
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 25 }
];

// Dynamic price thresholds
const budgetThreshold = 50;
const premiumThreshold = 500;

//  Assign product category using switch
function getCategory(price) {
    switch (true) {
        case price < budgetThreshold:
            return "Budget";

        case price >= premiumThreshold:
            return "Premium";

        default:
            return "Standard";
    }
}

// Calculate total inventory value
function calculateTotalValue(items) {
    let total = 0;

    for (const item of items) {
        total += item.price;
    }

    return total;
}

// Arrow functions for tax and discount
const calculateTax = (amount) => {
    const taxRate = 0.08;
    return amount * taxRate;
};

const calculateDiscount = (price) => {
    const discountRate = 0.10;
    return price >= premiumThreshold
        ? price * discountRate
        : 0;
};

// Main interactive program
async function main() {
    console.log("===== PRODUCT INVENTORY DASHBOARD =====");

    // if...else validation and continue
    let productName = "";

    while (true) {
        productName = (await askQuestion(
            "\nEnter product name to add: "
        )).trim();

        if (productName === "") {
            console.log("Product name cannot be empty. Try again.");
            continue;
        } else {
            break;
        }
    }

    let productPrice;

    while (true) {
        const priceInput = (await askQuestion(
            "Enter product price: "
        )).trim();

        productPrice = Number(priceInput);

        if (
            priceInput === "" ||
            !Number.isFinite(productPrice) ||
            productPrice <= 0
        ) {
            console.log("Invalid price. Enter a number greater than 0.");
            continue;
        } else {
            break;
        }
    }

    // Add the new product object to the array
    const newProduct = {
        name: productName,
        price: productPrice,
        category: getCategory(productPrice)
    };

    products.push(newProduct);

    // Add categories to existing products too
    products.forEach((product) => {
        if (!product.category) {
            product.category = getCategory(product.price);
        }
    });

    //  Display all products using forEach()
    console.log("\n===== ALL PRODUCTS =====");

    products.forEach((product) => {
        console.log(
            `Product: ${product.name} | Price: $${product.price} | Category: ${product.category}`
        );
    });

    //  Search product using loop, continue and break
    const searchName = (await askQuestion(
        "\nEnter a product name to search: "
    )).trim();

    let found = false;

    for (const product of products) {
        if (product.name.toLowerCase() !== searchName.toLowerCase()) {
            continue;
        }

        console.log(
            `Found: ${product.name} | Price: $${product.price} | Category: ${product.category}`
        );

        found = true;
        break;
    }

    if (!found) {
        console.log("Product not found.");
    }

    //  Filter affordable products
    const affordableProducts = products.filter(
        (product) => product.price < 200
    );

    console.log("\n===== AFFORDABLE PRODUCTS (UNDER $200) =====");
    console.log(affordableProducts);

    // Map products to a formatted report
    const formattedReport = products.map(
        (product) => `${product.name.toUpperCase()}: $${product.price}`
    );

    console.log("\n===== FORMATTED REPORT =====");
    console.log(formattedReport);

    //  Inventory analytics
    const totalValue = calculateTotalValue(products);
    const totalTax = calculateTax(totalValue);

    const totalDiscount = products.reduce(
        (sum, product) => sum + calculateDiscount(product.price),
        0
    );

    console.log("\n===== INVENTORY ANALYTICS =====");
    console.log("Total products:", products.length);
    console.log("Total inventory value: $" + totalValue);
    console.log("Estimated tax (8%): $" + totalTax.toFixed(2));
    console.log("Potential discounts: $" + totalDiscount.toFixed(2));

    rl.close();
}

main().catch((error) => {
    console.error("Something went wrong:", error);
    rl.close();
});