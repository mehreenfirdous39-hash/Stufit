const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// HOME
app.get("/", (req, res) => {
    res.send("StuFit Backend is Running!");
});


// REGISTER
app.post("/register", async (req, res) => {

    console.log("REGISTER REQUEST RECEIVED");
    console.log(req.body);

    const { name, email, password, age, college } = req.body;

    try {

        const connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        await connection.execute(
            `INSERT INTO users
            (name, email, password, age, college)
            VALUES
            (:name, :email, :password, :age, :college)`,
            {
                name: name,
                email: email,
                password: password,
                age: age,
                college: college
            },
            {
                autoCommit: true
            }
        );

        await connection.close();

        console.log("USER REGISTERED SUCCESSFULLY");

        res.json({
            success: true,
            message: "Registration successful!"
        });

    } catch (error) {

        console.log("REGISTER ERROR:");
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Registration failed!"
        });
    }
});


// AI COACH
app.post("/ai-coach", async (req, res) => {

    console.log("AI COACH REQUEST RECEIVED");
    console.log(req.body);

    const question = req.body.question;

    if (!question || question.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Please ask something to the AI Coach."
        });
    }


    const q = question.toLowerCase();

    let answer = "";


    // WORKOUT
    if (
        q.includes("workout") ||
        q.includes("exercise") ||
        q.includes("fitness") ||
        q.includes("exercise")
    ) {

        answer = `
For a beginner, try a simple 20–30 minute routine:

• 5 minutes warm-up
• 10 squats
• 10 wall push-ups
• 10 glute bridges
• 20-second plank
• Repeat the easy set 2–3 times
• Finish with gentle stretching

Start comfortably and stop if something hurts.
`;

    }


    // FOOD / NUTRITION
    else if (
        q.includes("food") ||
        q.includes("eat") ||
        q.includes("breakfast") ||
        q.includes("lunch") ||
        q.includes("dinner") ||
        q.includes("nutrition") ||
        q.includes("meal")
    ) {

        answer = `
Try to keep your meals balanced.

A simple student-friendly plate can include:
• Rice or roti
• Dal / beans / paneer / egg
• Vegetables
• Curd or another suitable protein source
• Fruits during the day

You don't need extreme diets. Focus on regular, balanced meals.
`;

    }


    // WATER / HYDRATION
    else if (
        q.includes("water") ||
        q.includes("hydration") ||
        q.includes("drink")
    ) {

        answer = `
Stay hydrated throughout the day.

Keep a water bottle with you during college and take regular
drinks instead of waiting until you feel very thirsty.

Your water needs can vary depending on activity, weather and
your individual needs.
`;

    }


    // SLEEP
    else if (
        q.includes("sleep") ||
        q.includes("tired") ||
        q.includes("sleeping")
    ) {

        answer = `
For better sleep:

• Try to keep a regular sleep schedule
• Reduce phone use before sleeping
• Avoid studying continuously without breaks
• Keep your sleeping environment comfortable
• Give yourself enough time to rest

Good sleep can help both study and daily activities.
`;

    }


    // STUDY
    else if (
        q.includes("study") ||
        q.includes("exam") ||
        q.includes("assignment") ||
        q.includes("college")
    ) {

        answer = `
Try a simple student routine:

• Study for 40–50 minutes
• Take a 5–10 minute movement break
• Keep water nearby
• Avoid skipping meals
• Get enough sleep before important study days

Small consistent habits are easier to maintain than extreme routines.
`;

    }


    // MOTIVATION
    else if (
        q.includes("motivation") ||
        q.includes("lazy") ||
        q.includes("stress") ||
        q.includes("stressful")
    ) {

        answer = `
Don't try to change everything in one day.

Start with one small action:
• Take a short walk
• Drink some water
• Complete one study task
• Do a few gentle stretches
• Take a proper break

Small progress is still progress. 🌱
`;

    }


    // GREETING
    else if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
    ) {

        answer = `
Hey! 👋 I'm your StuFit Coach.

You can ask me about:
• Workouts
• Food and nutrition
• Hydration
• Sleep
• Study routine
• Fitness habits
• Motivation
`;

    }


    // DEFAULT
    else {

        answer = `
I'm your StuFit student wellness coach. 😊

You can ask me things like:

• "Give me a beginner workout"
• "What should I eat for breakfast?"
• "How can I improve my sleep?"
• "How much water should I drink?"
• "How can I balance study and fitness?"

Try asking one of these!
`;

    }


    console.log("STUFIT COACH RESPONSE SENT");

    res.json({
        success: true,
        answer: answer
    });

});


// START SERVER
const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `StuFit Backend running on http://127.0.0.1:${PORT}`
    );

});