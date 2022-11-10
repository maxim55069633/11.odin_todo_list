

class Todo{
    constructor(title, start_date, due_date, status, priority, detail ){
        this.title=title;
        this.start_date=start_date;
        this.due_date=due_date;
        this.status=status;
        this.priority=priority;
        this.detail=detail;
    }

    static create_default_todo () {
        const sample =[new Todo("Sample", new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10), "Uncompleted", "1", "To be continued" )];
        
        return sample;
    }

    static edit_todo(e){


        const target_todo = e.target.parentNode.parentNode.parentNode;
        const target_todo_index = target_todo.current_todo_index;

        const target_project =target_todo.parentNode.parentNode.parentNode.parentNode.parentNode;
        const target_project_index = target_project.current_project_index;
        
        const edit_todo_buttons = document.querySelectorAll(`.modal-body>form[class="edit_todo_form"]`);
       
        edit_todo_buttons.forEach(
            item=>{
                    const item_todo = item.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    const item_todo_index = item_todo.current_todo_index;
                    const item_project =target_todo.parentNode.parentNode.parentNode.parentNode.parentNode;
                    const item_project_index = item_project.current_project_index;
       

                    item.addEventListener("submit", 
                        (e) => {
                            const formData = new FormData(e.target);

                            const newly_edited_todo=new Todo(
                            formData.get("edit_todo_title"),
                            formData.get("edit_todo_start_date"),
                            formData.get("edit_todo_due_date"),
                            formData.get("edit_todo_status"),
                            formData.get("edit_todo_priority"),
                            formData.get("edit_todo_detail")
                            );

                            Project.users_project_book[item_project_index]["todo_lists"].splice(item_todo_index, 1, newly_edited_todo);
                            Project.store_projects_locally();
                        }
                    );  
                
            }
        );
    }



    static display_todo_section(){
        const accordion_sections = document.querySelectorAll(`div[class="accordion-collapse collapse"]`);
        accordion_sections.forEach( 
            (item, index) =>{


                const todo_section =document.createElement("div");
                todo_section.innerHTML= `
                    <h2>Todos for Project ${index+1}</h2>
                    <div class="sort_section">
                        <label for="sorted_by">Sorted by: </label>
                        <select name="sorted_by" id="sorted_by_${index}" required>
                            <option value="title">Title</option>
                            <option value="status">Status</option>
                            <option value="priority">Priority</option>
                            <option value="due_date">Due Date</option>
                        </select>
                    </div>
                    <div class="display_todo_list_${index}"></div>
                    `;
                todo_section.classList.add("todo_section");
                todo_section.current_project_id = index;
                item.appendChild(todo_section);

            }
         )

        Project.users_project_book.forEach( 
            (item, index)=>{
                Todo.display_todo_lists(item, index);
            }
         );

         accordion_sections.forEach( 
            (item, index) =>{
                const sort_change_listener =document.querySelector(`#sorted_by_${index}`);
                sort_change_listener.addEventListener("change", Todo.change_the_todo_section
                 );
            }
         )
    }

    static sorted_by_title(a,b){
        if ( a["title"] <= b["title"] )
            return -1;
        else 
            return 1;
    }

    static sorted_by_status(a,b){
        if ( a["status"] <= b["status"] )
            return -1;
        else
            return 1;
    }

    static sorted_by_priority(a,b){
        if (a["priority"] <= b["priority"]) 
            return -1;
         else 
            return 1;
        
    }

    static sorted_by_due_date(a,b){
        if (a["due_date"] >= b["due_date"]) {
            return 1;
            // Make sure the most ergent event comes first 
        } else {
            return -1;
        }
    }

    static  change_the_todo_section(e){
        const current_project_index = e.target.parentNode.parentNode.current_project_id;
        const sort_by = e.target.value;
        if (sort_by === 'status'){
            Project.users_project_book[current_project_index]["todo_lists"].sort( Todo.sorted_by_status);
        } else if (sort_by === 'priority' ) {
            Project.users_project_book[current_project_index]["todo_lists"].sort( Todo.sorted_by_priority);
        } else if (sort_by === 'title') {
            Project.users_project_book[current_project_index]["todo_lists"].sort( Todo.sorted_by_title);
        } else if (sort_by === 'due_date' ){
            Project.users_project_book[current_project_index]["todo_lists"].sort( Todo.sorted_by_due_date);
        }

        Todo.display_todo_section();
    }
    

    static delete_todo(e){
        
        const target_todo = e.target.parentNode.parentNode.parentNode;
        const target_todo_index = target_todo.current_todo_index;

        const target_project =target_todo.parentNode.parentNode.parentNode.parentNode.parentNode;
        const target_project_index = target_project.current_project_index;

        Project.users_project_book[target_project_index]["todo_lists"].splice(target_todo_index, 1);
        Project.store_projects_locally();
        Todo.display_todo_section();
        
    }

    static display_todo_lists( current_project, project_index ) {
            const display_todo_list = document.querySelector(`.display_todo_list_${project_index}`);
            display_todo_list.innerHTML="";
        
            current_project["todo_lists"].forEach( (todo_item, todo_index) =>{
                const todo_pair = document.createElement("div");

                    const todo_modal=document.createElement("div");
                    todo_modal.innerHTML=`
                    <div class="modal fade" id="todo_modal_project${project_index}_${todo_index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="todo_modal_project${project_index}_${todo_index}Label" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="todo_modal_project${project_index}_${todo_index}">Project ${project_index+1} - Todo ${todo_index+1} </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            
                                <div class="modal-body">
                                
                                    <form action="#" class="edit_todo_form"  id="edit_project${project_index}_todo${todo_index}">
                                    <fieldset>
                                    <legend class="edit_todo_legend">Edit this todo:</legend>
                                    <div class="edit_todo_flex_area">
                                        <div class="edit_todo_row">
                                            <label for="edit_todo_title">Todo Title: </label>
                                            <input type="text" name="edit_todo_title" id="edit_todo_title_project${project_index}_todo${todo_index}" required>    
                                        </div>

                                        <div class="edit_todo_row">
                                            <label for="edit_todo_start_date">Todo Start Date: </label>
                                            <input type="date" name="edit_todo_start_date" id="edit_todo_start_date_project${project_index}_todo${todo_index}" required>    
                                        </div>

                                        <div class="edit_todo_row">
                                            <label for="edit_todo_due_date">Todo Due Date: </label>
                                            <input type="date" name="edit_todo_due_date" id="edit_todo_due_date_project${project_index}_todo${todo_index}" required>    
                                        </div>

                                        <div class="edit_todo_row">
                                            <label for="edit_todo_status">Status: </label>
                                            <select name="edit_todo_status" id="edit_todo_status" required>
                                                <option value="Completed">Completed</option>
                                                <option value="Uncompleted">Uncompleted</option>
                                            </select>
                                        </div>
                                        
                                        <div class="edit_todo_row">
                                            <label for="edit_todo_priority">Priority: </label>
                                            <select name="edit_todo_priority" id="edit_todo_priority" required>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </select>
                                        </div>

                                        <div class="edit_todo_row">
                                            <label for="edit_todo_detail">Detail: </label>
                                            <textarea name="edit_todo_detail" cols="30" rows="3" maxlength="1500"></textarea>
                                        </div>
                                    </div>
                                    </fieldset>
                                    </form>

                                </div>
                                
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary  " data-bs-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary todo_edit_submit"  form="edit_project${project_index}_todo${todo_index}">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    todo_pair.appendChild(todo_modal);

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

                    const todo_control_icon = document.createElement("span");
                    todo_control_icon.innerHTML =
                        `<span class="todo_edit_icon" data-bs-toggle="modal" data-bs-target="#todo_modal_project${project_index}_${todo_index}" ><span>EDIT</span> </span>
                        <span class="todo_detail_icon" id="todo_detail_project${project_index}_${todo_index}" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right" ><span>DETAIL</span> </span>
                        <span class="todo_del_icon"><span>DELETE</span></span>`;
                    todo_control_icon.classList.add("todo_general_pair");
                    todo_pair.appendChild(todo_control_icon);

                todo_pair.classList.add("todo_general");
                todo_pair.current_todo_index = todo_index;
                
            display_todo_list.appendChild(todo_pair);

            const todo_detail_hidden_content = document.querySelector(`#todo_detail_project${project_index}_${todo_index}`);
            todo_detail_hidden_content.setAttribute("title", Project.users_project_book[project_index]["todo_lists"][todo_index]["detail"]);
            } 
         );


        // edit todo listener
        const edit_todo_buttons =document.querySelectorAll(".todo_edit_icon");
        edit_todo_buttons.forEach( (item) =>{
            item.addEventListener("click", Todo.edit_todo );
        } )

        // delete todo listener
        const delete_todo_buttons = document.querySelectorAll(".todo_del_icon");
        delete_todo_buttons.forEach( (item) => {
            item.addEventListener("click", Todo.delete_todo );
        } )

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

    // We don't need this find function anymore, because the index has been stored in the object as an attribute.
    // static find_target_project(target_element_title){
    //     const my_current_projects = Project.users_project_book;

    //     let target_index = -1;
    //             my_current_projects.forEach( (item, index) => {

    //                 if ( item["title"]  === target_element_title)
    //                 // it's better to check id rather than the title. 
    //                     target_index= index;

    //             }
    //         )
    //     return target_index;
    // }

    static delete_project(e){
        
        const target_element = e.target.parentNode.parentNode.parentNode;
        // const my_current_projects = this.users_project_book; won't work Here the scope of this has changed.
        
        // const index_of_project_to_be_deleted = Project.find_target_project(target_element_title);
        // Since we store the project index as an attribute, we don't need a find function anymore.

        const index_of_project_to_be_deleted = target_element.parentNode.current_project_index

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
                    const index_of_project_to_be_edited = e.target.parentNode.parentNode.parentNode.current_project_index;
                    const formData = new FormData(e.target);

                    const newly_edited_project=new Project(
                    formData.get("edit_project_title"),
                    formData.get("edit_project_description"),
                    formData.get("edit_project_date"),
                    formData.get("edit_project_status"), 
                    Project.users_project_book[index_of_project_to_be_edited]["todo_lists"]
                    );
                    
                    Project.users_project_book.splice(index_of_project_to_be_edited,1,newly_edited_project);
                    Project.store_projects_locally();
                }
            );  
           }
        );
    }

    static add_todo_for_current_project(){

        const add_todo_form_listeners= document.querySelectorAll(`form[class="add_todo_form"]`);

        add_todo_form_listeners.forEach(
            item=>{

                item.addEventListener("submit", (e)=>{


                    const target_project = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    const target_project_index = target_project.current_project_index;

                    const formData = new FormData(e.target);

                    const newly_added_todo=new Todo(
                    formData.get("add_todo_title"),
                    formData.get("add_todo_start_date"),
                    formData.get("add_todo_due_date"),
                    formData.get("add_todo_status"),
                    formData.get("add_todo_priority"),
                    formData.get("add_todo_detail")
                    );
                    
                    
                    Project.users_project_book[target_project_index]["todo_lists"].push(newly_added_todo);
                    Project.store_projects_locally();
                } )
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
                `<span class="project_edit_icon collapsed"  type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${index}" aria-expanded="true" aria-controls="collapse_${index}"><span>EDIT</span> <svg class="rotation" style="width:24px;height:24px" viewBox="0 0 24 24">
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
                    <form action="#"  id="edit_project_form_${index}">
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

                        <button type="button" class="project_add_todo" data-bs-toggle="modal" data-bs-target="#add_todo_modal_project${index}">
                            Add a todo
                        </button>

                     

                    </div>
                    </fieldset>
                    </form>


                    <div class="modal fade" id="add_todo_modal_project${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="add_todo_modal_project${index}_Label" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="add_todo_modal_project${index}_Label">Add a Todo for Project ${index+1}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">

                            <form action="#" class="add_todo_form" id="add_todo_for_project${index}">
                                <fieldset>
                                <div class="add_todo_flex_area">
                                    <div class="add_todo_row">
                                        <label for="add_todo_title">Todo Title: </label>
                                        <input type="text" name="add_todo_title" id="add_todo_title_for_project${index}" required>    
                                    </div>

                                    <div class="add_todo_row">
                                        <label for="add_todo_start_date">Todo Start Date: </label>
                                        <input type="date" name="add_todo_start_date" id="add_todo_start_date_for_project${index}" required>    
                                    </div>

                                    <div class="add_todo_row">
                                        <label for="add_todo_due_date">Todo Due Date: </label>
                                        <input type="date" name="add_todo_due_date" id="add_todo_due_date_for_project${index}" required>    
                                    </div>

                                    <div class="add_todo_row">
                                        <label for="add_todo_status">Status: </label>
                                        <select name="add_todo_status" id="add_todo_status" required>
                                            <option value="Completed">Completed</option>
                                            <option value="Uncompleted">Uncompleted</option>
                                        </select>
                                    </div>
                                    
                                    <div class="add_todo_row">
                                        <label for="add_todo_priority">Priority: </label>
                                        <select name="add_todo_priority" id="add_todo_priority" required>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>

                                    <div class="add_todo_row">
                                        <label for="add_todo_detail">Detail: </label>
                                        <textarea name="add_todo_detail" cols="30" rows="3" maxlength="1500"></textarea>
                                    </div>
                                </div>
                                </fieldset>
                            </form>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" form="add_todo_for_project${index}">Confirm</button>
                            </div>
                            </div>
                        </div>
                    </div>

                    
                </div>`;

                project_item.appendChild(project_edit);
                project_edit.classList.add("project_edit");

            project_item.classList.add("project_item");
            project_list.appendChild(project_item);
            project_item.current_project_index= index;


            // Setting placeholder as an attribute in the input won't keep the spaces 
            document.getElementById(`edit_project_title_${index}`).placeholder =item["title"];


        });

        Todo.display_todo_section();

        const delete_buttons = document.querySelectorAll(".project_del_icon");
        delete_buttons.forEach(item => item.addEventListener("click", this.delete_project) );
        this.edit_project();
        this.add_todo_for_current_project();
    }
}

// Display the existing projects
Project.display_projects();
Project.add_listener();