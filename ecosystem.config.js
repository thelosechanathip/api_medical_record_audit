module.exports = {
    apps: [
        {
            name: "api_medical_record_audit",
            script: "server.js",
            interpreter: "node",
            watch: ["server.js", "routes"],
            ignore_watch: ["node_modules", "*.log"],
            cwd: "/var/www/html/api_medical_record_audit", // ระบุโฟลเดอร์ทำงาน
            env: {
                NODE_ENV: "production",
                BASE_PATH: "api"
            },
            instances: 1,
            exec_mode: "fork"
        }
    ]
};