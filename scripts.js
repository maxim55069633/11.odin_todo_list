
class Todo{
    constructor(title, start_date, due_date, status, priority, description ){
        this.title=title;
        this.start_date=start_date;
        this.due_date=due_date;
        this.status=status;
        this.priority=priority;
        this.description=description;
    }
}

class Project{
    constructor(title, description, due_date, status) {
        this.title=title;
        this.description=description;
        this.due_date=due_date;
        this.status = status;
    }

    static initiate_users_project_book(){

        const project_1 = new Project("TOP", "Finish TOP and find a job as soon as possible", "2023-2-1", "Completed");
        const project_2 = new Project("Italian A2", "Improve my italian to next level so I can travel around italy someday", "2022-12-30", "Uncompleted");

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
            formData.get("project_status")
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

                    const newly_edited_project=new Project(
                    formData.get("edit_project_title"),
                    formData.get("edit_project_description"),
                    formData.get("edit_project_date"),
                    formData.get("edit_project_status")
                    );
                    
                    const index_of_project_to_be_edited = Project.find_target_project(item_project["title"]);
                    
                    
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
                item_title.innerHTML = `<span>Project Name: </span><span>${item['title']}</span>`;
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
                </div>`;
                project_item.appendChild(project_edit);
                project_edit.classList.add("project_edit");

            project_item.classList.add("project_item");
            project_list.appendChild(project_item);

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