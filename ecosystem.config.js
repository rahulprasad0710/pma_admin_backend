module.exports = {
    apps: [
        {
            name: "project-management-app-backend",
            script: "./dist/index.js",
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
