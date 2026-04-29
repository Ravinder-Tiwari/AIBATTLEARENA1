import app from "./src/app.js"
import { connectToDatabase } from "./src/config/db.js"

const port = Number(process.env.PORT) || 3000


connectToDatabase()

app.listen(port, "0.0.0.0", () => {
    console.log(`server is running on port ${port}.`)
})
