
class Todo{
    constructor(title, start_date, due_date, status, priority, description ){
        this.title=title;
        this.start_date=start_date;
        this.due_date=due_date;
        this.status=status;
        this.priority=priority;
        this.description=description;
    }

    static create_default_todo () {
        const sample =[new Todo("Sample", new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10), "Uncompleted", "1", "To be continued" )];
        console.log(sample);
        return sample;
    }

    static display_todo_lists( current_project, project_index ) {
            const display_todo_list = document.querySelector(`.display_todo_list_${project_index}`);
        
            current_project["todo_lists"].forEach( (todo_item, todo_index) =>{
                const todo_pair = document.createElement("div");
                    const todo_object_title = document.createElement("span");
                    todo_object_title.innerHTML =  `<span>Todo ${todo_index+1} Title: </span><span>${todo_item["title"]}</span>`;
                    todo_object_title.classList.add("todo_general_pair");
                    todo_pair.appendChild( todo_object_title );
                    
                    const todo_object_group = document.createElement("span");
                        const todo_object_due_date = document.createElement("span");
                        todo_object_due_date.innerHTML =  `<span>Due Date: </span><span>${todo_item["due_date"]}</span>`;
                        todo_object_group.appendChild(todo_object_due_date);
                        
                        const todo_object_status = document.createElement("span");
                        todo_object_status.innerHTML =  `<span>Status: </span><span>${todo_item["status"]}</span>`;
                        todo_object_group.appendChild(todo_object_status);

                        const todo_object_priority = document.createElement("span");
                        todo_object_priority.innerHTML =  `<span>Priority: </span><span>${todo_item["priority"]}</span>`;
                        todo_object_group.appendChild(todo_object_priority);
                    todo_object_group.classList.add("todo_general_pair");
                    todo_pair.appendChild( todo_object_group );

                todo_pair.classList.add("todo_general");
            display_todo_list.appendChild(todo_pair);
            } 
         )
        
    }
}

class Project{
    constructor(title, description, due_date, status, todo_lists) {
        this.title=title;
        this.description=description;
        this.due_date=due_date;
        this.status = status;
        this.todo_lists=todo_lists;
    }

    static initiate_users_project_book(){

        const project_1_todo_1 = new Todo("Complete the Foundation module", "2022-8-1", "2022-9-1", "Completed", "2", "I will gain the basic knowledge about HTML, CSS, Javascript when I finish the Foundation module.");
        const project_1_todo_2 = new Todo("Complete the Full Stack Javascript module", "2022-9-1", "2023-2-1", "Uncompleted", "1", "This part teaches me the job-ready skills and helps me build my unique portfolio.");

        const project_2_todo_1 = new Todo("1 lesson a day on Duolingo", "2021-10-1", "2023-1-1", "Uncompleted", "3", "This is beneficial for my grammar and vocabulary.");
        const project_2_todo_2 = new Todo("Italki italian intensive training", "2023-1-1", "2023-7-1", "Uncompleted", "2", "My listening and speaking skills will be improved.");
        const project_2_todo_3 = new Todo("Upwork writing class", "2023-5-1", "2023-8-1","Uncompleted", "2" , "I will feel more confident in my italian and be able to understand the basic conversations");

        const project_1 = new Project("TOP", "Finish TOP and find a job as soon as possible", "2023-2-1", "Completed", [project_1_todo_1, project_1_todo_2]);
        const project_2 = new Project("Italian A2", "Improve my italian to next level so I can travel around italy someday", "2022-12-30", "Uncompleted", [project_2_todo_1, project_2_todo_2, project_2_todo_3]);

        const original_project=[];
        original_project.push(project_1);
        original_project.push(project_2);

        return original_project;
    }

    static is_session_stored_before(){
        let test = JSON.parse(sessionStorage.getItem("session"));
        if (test !== null)
            return true;
        else
            return false;
    }


    static store_projects_locally(){
        sessionStorage.setItem("session", JSON.stringify( this.users_project_book ));
    }

    static fetch_projects_locally(){
        return Object.values(JSON.parse(sessionStorage.getItem("session")) );
    }

    static add_a_new_project(item){
        this.users_project_book.push(item);
        this.store_projects_locally();
    }


    // this.is_session_stored_before? this.fetch_projects_locally : 
    static users_project_book =this.is_session_stored_before()? this.fetch_projects_locally() :this.initiate_users_project_book();


    static add_listener(){
        // Add Project
        let cancel_span=document.querySelector(".project_cancel");
        let form =document.querySelector(".newProject>form");
        let add_icon = document.querySelector(".project_add_icon");

        add_icon.onclick=function(){
            form.style.display="block";
            add_icon.style.display="none";  
        }

        cancel_span.onclick=function(){
            form.style.display="none";
            add_icon.style.display="flex";
        }
        document.querySelector('form#add_new_project_form').addEventListener('submit', (e) => {

            const formData = new FormData(e.target);

            const newly_added_project=new Project(
            formData.get("project_title"),
            formData.get("project_description"),
            formData.get("project_date"),
            formData.get("project_status"),
            Todo.create_default_todo()
            // empty array represents we don't have any todo for newly created project 
            );
        
            Project.add_a_new_project(newly_added_project);

            // We don't need e.preventDefault();. Because when we add a new project, we refresh the page. 

        });
    }


    static find_target_project(target_element_title){
        const my_current_projects = Project.users_project_book;

        let target_index = -1;
                my_current_projects.forEach( (item, index) => {

                    if ( item["title"]  === target_element_title)
                    // it's better to check id rather than the title. 
                        target_index= index;

                }
            )
        return target_index;
    }

    static delete_project(e){
        
        const target_element = e.target.parentNode.parentNode.parentNode;
        const target_element_title = target_element.childNodes[0].childNodes[1].textContent;
        
        // const my_current_projects = this.users_project_book; won't work Here the scope of this has changed.
        
        const index_of_project_to_be_deleted = Project.find_target_project(target_element_title);
        // scripts.js:106 Uncaught TypeError: this.find_target_project is not a function
        // This is the same reason like the above. We call the function asynchronously

        Project.users_project_book.splice(index_of_project_to_be_deleted,1);
        Project.store_projects_locally();
        Project.display_projects();
    }


    static edit_project(){
        this.users_project_book.forEach( (item_project, index)=> {
            const edit_button = document.querySelector(`form[id="edit_project_form_${index}"]`);
         
            edit_button.addEventListener("submit", 
                (e) => {
                    const formData = new FormData(e.target);
                    const index_of_project_to_be_edited = Project.find_target_project(item_project["title"]);
                    
                    const newly_edited_project=new Project(
                    formData.get("edit_project_title"),
                    formData.get("edit_project_description"),
                    formData.get("edit_project_date"),
                    formData.get("edit_project_status"), 
                    Project.users_project_book[index_of_project_to_be_edited]["todo_lists"]
                    );
                    
                    
                    console.log(index_of_project_to_be_edited);
                    Project.users_project_book.splice(index_of_project_to_be_edited,1,newly_edited_project);
                    Project.store_projects_locally();
                }
            );  
           }
        );

        


    }

    static display_projects(){
        
        let project_list = document.querySelector(".listView");
        project_list.innerHTML = ""; 
        // reset the content
        this.users_project_book.forEach( (item, index) => {

            const project_item = document.createElement("div");

                const project_general = document.createElement("div");

                const item_title =document.createElement("span");
                item_title.innerHTML = `<span>Project ${index+1} Name: </span><span>${item['title']}</span>`;
                item_title.classList.add("project_general_pair");
                project_general.appendChild( item_title );

                const item_due_date = document.createElement("span");
                item_due_date.innerHTML = `<span>Due date: </span><span>${item["due_date"]}</span>`;
                item_due_date.classList.add("project_general_pair");
                project_general.appendChild(item_due_date);

                const item_status = document.createElement("span");
                item_status.innerHTML = `<span>Status: </span><span>${item["status"]}</span>`;
                item_status.classList.add("project_general_pair");
                project_general.appendChild(item_status);

                const item_control_icon = document.createElement("span");
                item_control_icon.innerHTML =
                `<span class="project_view_icon"><span>VIEW</span></span>
                <span class="project_edit_icon collapsed"  type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${index}" aria-expanded="true" aria-controls="collapse_${index}"><span>EDIT</span> <svg class="rotation" style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M1,21H23L12,2" />
            </svg></span>
                <span class="project_del_icon"><span>DELETE</span></span>`;
                item_control_icon.classList.add("project_general_pair");
                project_general.appendChild(item_control_icon);
                project_general.classList.add("project_general");

                project_item.appendChild(project_general);

                const project_edit = document.createElement("div");

                const current_project = this.users_project_book[index] ;

                project_edit.innerHTML = `

                <div id="collapse_${index}" class="accordion-collapse collapse" aria-labelledby="heading_${index}" >
                    <form action="#" method="post" id="edit_project_form_${index}">
                    <fieldset>
                    <legend class="edit_project_legend">Edit this project:</legend>
                    <div class="edit_project_flex_area">
                        <div class="edit_project_row">
                            <label for="edit_project_title">Project Name: </label>
                            <input type="text" name="edit_project_title" id="edit_project_title_${index}" required>    
                        </div>
        
                        <div class="edit_project_row">
                            <label for="edit_project_description">Description: </label>
                            <textarea name="edit_project_description" id="edit_project_description" cols="30" rows="3" maxlength="1500">${current_project["description"]}</textarea>
                        </div>
            
                        <div class="edit_project_row">
                            <label for="edit_project_date">Due Date: </label>
                            <input type="date" name="edit_project_date" id="edit_project_date" required>
                        </div>
        
                        <div class="edit_project_row">
                            <label for="edit_project_status">Status: </label>
                            <select name="edit_project_status" id="edit_project_status" required>
                                <option value="Completed">Completed</option>
                                <option value="Uncompleted">Uncompleted</option>
                            </select>
                        </div>    
                    </div>
        
        
                    <div class="edit_project_buttons">
                        <button type="submit" class="project_edit_submit" form="edit_project_form_${index}">
                            Save changes
                        </button>

                        <button type="button" class="project_add_todo">
                            Add a todo
                        </button>
                    </div>
                    </fieldset>
                    </form>

                    <div class="todo_section">
                        <h2>Todos for project ${index+1}</h2>
                        <div class="display_todo_list_${index}"></div>
                    </div>
                    
                </div>`;
                project_item.appendChild(project_edit);
                project_edit.classList.add("project_edit");

            project_item.classList.add("project_item");
            project_list.appendChild(project_item);

            Todo.display_todo_lists(item, index);

            // Setting placeholder as an attribute in the input won't keep the spaces 
            document.getElementById(`edit_project_title_${index}`).placeholder =item["title"];

        });

        const delete_buttons = document.querySelectorAll(".project_del_icon");
        delete_buttons.forEach(item => item.addEventListener("click", this.delete_project) );

        this.edit_project();
    }


}



// Display the existing projects
Project.display_projects();
Project.add_listener();