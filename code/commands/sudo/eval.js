module.exports = {
    name: "eval",
    description: "Evaluates an expression or executes a line of code",

    async execute(client, message, args) {
        try {
            const total = args.join(" ");
            var result = await eval(total, (error) => {});
            console.log(result);
        } catch (error) {}
    },
};
