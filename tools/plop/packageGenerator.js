module.exports = {
  prompts: [
    {
      type: "list",
      name: "packageType",
      message: "What kind of package to create ?",
      choices: ["react", "react-native", "webpack", "basic", "node"],
      default: 0,
    },
    {
      type: "input",
      name: "packageName",
      message: "What is the name of the new package ?",
    },
  ],
  actions: (data) => {
    const destination = "../../packages/{{packageName}}/";
    function addMany(templateName) {
      return {
        type: "addMany",
        destination,
        templateFiles: "templates/" + templateName + "/**",
        base: "templates/" + templateName,
        force: true,
        globOptions: {
          dot: true,
        },
      };
    }
    const actions = [
      // add the files common to every package type
      addMany("common"),
    ];

    switch (data.packageType) {
      case "react":
        actions.push(addMany("react"));
        break;
      case "react-native":
        actions.push(addMany("react-native"));
        break;
      case "node":
        actions.push(addMany("node"));
        break;
      case "basic":
        actions.push(addMany("basic"));
        break;
      case "webpack":
        // for webpack, add also the react template
        actions.push(addMany("react"));
        actions.push(addMany("webpack"));
        break;
    }
    return actions;
  },
};
