// Utility function: get random percentages that average 50%
function getRandomPercentages(n) {
    let arr = Array.from({ length: n }, () => Math.random());
    let avg = arr.reduce((a, b) => a + b, 0) / n;
    let scale = 0.5 / avg;
    return arr.map(x => Math.round(Math.min(1, Math.max(0, x * scale)) * 100));
}

class client_application {
    // ...other methods unchanged...

    async display_hwks() {
        const homeworks = await this.get_hwks();
        const panel = document.getElementById("hw_container");
        panel.innerHTML = "";
        this.homeworks = homeworks.homework;
        this.homeworks.reverse();
        console.log(homeworks);

        const selbutton = document.getElementById("selectall");
        selbutton.onclick = function select_checkbox() {
            let selallcheckbox = document.getElementsByName('boxcheck');
            for (var checkbox of selallcheckbox)
                checkbox.checked = this.checked;
        };
        let hw_idx = 0;
        for (const homework of this.homeworks) {
            // --- RANDOMIZE task percentages and assign to task ---
            let nTasks = homework.tasks.length;
            let percentages = getRandomPercentages(nTasks);
            homework.tasks.forEach((task, i) => {
                task.randomPercentage = percentages[i];
            });

            const hw_checkbox = document.createElement("input");
            hw_checkbox.type = "checkbox";
            hw_checkbox.name = "boxcheck";
            hw_checkbox.onclick = function () {
                set_checkboxes(
                    this.parentNode.nextElementSibling.id,
                    this.checked,
                );
            };
            const hw_name = document.createElement("span");
            hw_name.innerText = `${homework.name}`;
            hw_name.style.display = "block";
            hw_name.prepend(hw_checkbox);

            const hw_display = document.createElement("div");
            hw_display.id = `hw${homework.id}`;
            let idx = 0;
            for (const task of homework.tasks) {
                const task_checkbox = document.createElement("input");
                task_checkbox.type = "checkbox";
                task_checkbox.name = "boxcheck";
                task_checkbox.id = `${hw_idx}-${idx}`;

                const task_display = document.createElement("label");
                task_display.for = task_checkbox.id;

                // Always use our randomized value (not API)
                const percentage = task.randomPercentage;
                task_display.innerHTML = `${this.display_translations[task.translation]} - ${this.get_task_name(task)} (${percentage}%)`;

                const task_span = document.createElement("span");
                task_span.classList.add("task");

                task_span.appendChild(task_checkbox);
                task_span.appendChild(task_display);
                task_span.appendChild(document.createElement("br"));

                hw_display.appendChild(task_span);
                idx++;
            }
            panel.appendChild(hw_name);
            panel.appendChild(hw_display);
            hw_idx++;
        }
    }

    // ...rest of class unchanged...
}

// ...rest of file unchanged...
