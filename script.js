// REGISTER

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const age = document.getElementById("registerAge").value;
        const college = document.getElementById("registerCollege").value;

        const message = document.getElementById("registerMessage");

        message.innerText = "Registering...";

        try {

            const response = await fetch("http://127.0.0.1:5000/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    age: age,
                    college: college
                })

            });

            const data = await response.json();

            console.log(data);

            if (data.success) {

                message.innerText = "Registration successful!";

                localStorage.setItem(
                    "stuFitRegisteredUser",
                    JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        age: age,
                        college: college
                    })
                );

                registerForm.reset();

                setTimeout(function() {
                    window.location.href = "login.html";
                }, 1000);

            } else {

                message.innerText = data.message;

            }

        } catch (error) {

            console.log(error);

            message.innerText = "Unable to connect to backend.";

        }

    });

}

// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        // Both are compulsory
        if (email === "" || password === "") {
            message.innerText = "Email and password are required.";
            return;
        }

        // Get registered user
        const storedUser = localStorage.getItem("stuFitRegisteredUser");

        if (!storedUser) {
            message.innerText = "No account found. Please register first.";
            return;
        }

        const user = JSON.parse(storedUser);

        // Check email
        if (email !== user.email) {
            message.innerText = "Incorrect email.";
            return;
        }

        // Check password
        if (password !== user.password) {
            message.innerText = "Incorrect password.";
            return;
        }

        // Login successful
        localStorage.setItem("stuFitLoggedIn", "true");

        message.innerText = "Login successful!";

        setTimeout(function() {
            window.location.href = "profile.html";
        }, 500);
    });
}


// ==========================================
// PROFILE
// ==========================================

const profileContent = document.getElementById("profileContent");
const profileLocked = document.getElementById("profileLocked");

if (profileContent && profileLocked) {

    const isLoggedIn = localStorage.getItem("stuFitLoggedIn");
    const storedUser = localStorage.getItem("stuFitRegisteredUser");

    if (isLoggedIn === "true" && storedUser) {

        const user = JSON.parse(storedUser);

        // Hide login message
        profileLocked.style.display = "none";

        // Show profile
        profileContent.style.display = "block";

        // Display registered user's details
        document.getElementById("profileName").innerText = user.name;
        document.getElementById("profileEmail").innerText = user.email;
        document.getElementById("profileAge").innerText = user.age;
        document.getElementById("profileCollege").innerText = user.college;

    } else {

        // Before login
        profileLocked.style.display = "block";
        profileContent.style.display = "none";
    }
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("stuFitLoggedIn");

    window.location.href = "login.html";
}


// ==========================================
// AI COACH
// ==========================================

function askCoach() {

    const input = document.getElementById("coachInput");
    const response = document.getElementById("coachResponse");

    const question = input.value.trim();

    if (question === "") {
        response.innerText = "Please enter your question.";
        return;
    }

    response.innerText =
        "Your AI Coach: Maintain a balanced routine with regular movement, nutritious meals and enough rest.";
}
/* ================================= */
/* STUFIT ACADEMIC CALENDAR */
/* ================================= */

let calendarDate = new Date();

let academicEvents =
    JSON.parse(
        localStorage.getItem("stufitAcademicEvents")
    ) || [];


const calendarMonth =
    document.getElementById("calendarMonth");

const calendarDays =
    document.getElementById("calendarDays");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

const eventDate =
    document.getElementById("eventDate");

const eventType =
    document.getElementById("eventType");

const eventName =
    document.getElementById("eventName");

const saveEventBtn =
    document.getElementById("saveEventBtn");

const workoutRecommendation =
    document.getElementById("workoutRecommendation");


/* ================================= */
/* RENDER CALENDAR */
/* ================================= */

function renderAcademicCalendar() {

    if (!calendarDays) return;

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();

    const firstDay =
        new Date(year, month, 1).getDay();

    const totalDays =
        new Date(year, month + 1, 0).getDate();


    const monthName =
        calendarDate.toLocaleString(
            "default",
            { month: "long" }
        );


    calendarMonth.textContent =
        `${monthName} ${year}`;


    calendarDays.innerHTML = "";


    /* Empty spaces */

    for (let i = 0; i < firstDay; i++) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day empty";

        calendarDays.appendChild(empty);
    }


    /* Dates */

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const div =
            document.createElement("div");

        div.className =
            "calendar-day";


        const number =
            document.createElement("strong");

        number.textContent = day;


        div.appendChild(number);


        /* Today */

        const today =
            new Date();

        const todayDate =
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


        if (date === todayDate) {

            div.classList.add("today");
        }


        /* Event */

        const event =
            academicEvents.find(
                e => e.date === date
            );


        if (event) {

            div.classList.add(event.type);


            const dot =
                document.createElement("div");

            dot.className =
                "event-dot";


            if (event.type === "exam") {

                dot.textContent =
                    "🔴 Exam";
            }

            else if (
                event.type === "assignment"
            ) {

                dot.textContent =
                    "🟡 Assignment";
            }

            else {

                dot.textContent =
                    "🟢 Normal";
            }


            div.appendChild(dot);
        }


        /* Click */

        div.addEventListener(
            "click",
            function () {

                eventDate.value = date;

                showWorkout(date);
            }
        );


        calendarDays.appendChild(div);
    }
}


/* ================================= */
/* MONTH NAVIGATION */
/* ================================= */

if (prevMonth) {

    prevMonth.addEventListener(
        "click",
        function () {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderAcademicCalendar();
        }
    );
}


if (nextMonth) {

    nextMonth.addEventListener(
        "click",
        function () {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderAcademicCalendar();
        }
    );
}


/* ================================= */
/* ADD EVENT */
/* ================================= */

if (saveEventBtn) {

    saveEventBtn.addEventListener(
        "click",
        function () {

            const date =
                eventDate.value;

            const type =
                eventType.value;

            const name =
                eventName.value.trim();


            if (!date) {

                alert(
                    "Please select a date."
                );

                return;
            }


            if (!name) {

                alert(
                    "Please enter event name."
                );

                return;
            }


            /* Same date old event remove */

            academicEvents =
                academicEvents.filter(
                    e => e.date !== date
                );


            /* Add event */

            academicEvents.push({

                date: date,

                type: type,

                name: name

            });


            localStorage.setItem(
                "stufitAcademicEvents",
                JSON.stringify(
                    academicEvents
                )
            );


            renderAcademicCalendar();

            showWorkout(date);

            eventName.value = "";

            alert(
                "Academic event added! 🎉"
            );
        }
    );
}


/* ================================= */
/* WORKOUT RECOMMENDATION */
/* ================================= */

function showWorkout(date) {

    const event =
        academicEvents.find(
            e => e.date === date
        );


    if (!event) {

        workoutRecommendation.innerHTML = `
            💪 <strong>Regular Workout</strong>
            <br>
            Full Body + Walking + Cool Down
        `;

        return;
    }


    if (event.type === "exam") {

        workoutRecommendation.innerHTML = `
            🔴 <strong>Exam Day</strong>
            <br>
            ${event.name}
            <br><br>
            🧘 Light stretching + 
            10–15 min walking
            <br>
            Keep the workout easy and focus on studies.
        `;

        return;
    }


    if (event.type === "assignment") {

        workoutRecommendation.innerHTML = `
            🟡 <strong>Assignment Day</strong>
            <br>
            ${event.name}
            <br><br>
            🚶 15–20 min walking +
            light stretching
        `;

        return;
    }


    workoutRecommendation.innerHTML = `
        🟢 <strong>Normal Day</strong>
        <br>
        ${event.name}
        <br><br>
        💪 Regular beginner workout
    `;
}


/* ================================= */
/* START */
/* ================================= */

renderAcademicCalendar();

async function askCoach() {

    const input = document.getElementById("coachInput");
    const responseBox = document.getElementById("coachResponse");

    const question = input.value.trim();

    if (question === "") {
        responseBox.innerHTML = "Please ask me something first 😊";
        return;
    }

    responseBox.innerHTML = "🤖 Thinking...";

    try {

        const response = await fetch("http://127.0.0.1:5000/ai-coach", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        console.log("AI COACH DATA:", data);

        if (data.success) {

            responseBox.innerHTML =
                "<strong>🤖 StuFit AI Coach</strong><br><br>" +
                data.answer.replace(/\n/g, "<br>");

        } else {

            responseBox.innerHTML = "❌ " + data.message;
        }

    } catch (error) {

        console.log("AI COACH ERROR:", error);

        responseBox.innerHTML =
            "❌ Cannot connect to StuFit backend.";
    }
}
