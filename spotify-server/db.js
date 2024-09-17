const mongoose = require("mongoose");

module.exports = async () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds

	};
	try {
		await mongoose.connect(process.env.DB, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.error("Could not connect to database:", error);
		process.exit(1); // Exit process with failure
	}
};
