db.createUser(
    {
        user: "bigdata",
        pwd: "bigdata",
        roles: [
            {
                role: "readWrite",
                db: "spoofing"
            }
        ]
    }
);