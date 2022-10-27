
class Project{
    constructor(title, description, due_date, status) {
        this.title=title;
        this.description=description;
        this.due_date=due_date;
        this.status = status;
    }

    static initiate_users_project_book(){

        const project_1 = new Project("TOP", "Finish TOP and find a job as soon as possible", "2023-2-1", "2", "Completed");
        const project_2 = new Project("Italian A2", "Improve my italian to next level so I can travel around italy someday", "2022-12-30", "3", "Uncompleted");

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

        document.querySelector('form').addEventListener('submit', (e) => {

            const formData = new FormData(e.target);

            const newly_added_project=new Project(
            formData.get("project_name"),
            formData.get("project_description"),
            formData.get("project_date"),
            formData.get("project_status")
            );
        
            Project.add_a_new_project(newly_added_project);

            // We don't need e.preventDefault();. Because when we add a new project, we refresh the page. 

        });
    }


    static find_target_project(target_element){
        const my_current_projects = Project.users_project_book;

        let target_index = -1;
                my_current_projects.forEach( (item, index) => {
                    
                    if (
                        item["title"]  == target_element.parentNode.childNodes[0].childNodes[1].textContent &&
                        item["due_date"] == target_element.parentNode.childNodes[1].childNodes[1].textContent 
               
                        // No need to test the check status. item["status"] == target_element.parentNode.childNodes[3].childNodes[1].textContent
                    )
                        target_index= index;

                }
            )
        return target_index;
    }

   

    static display_projects(){
        
        let project_list = document.querySelector(".listView");
        project_list.innerHTML = ""; 
        // reset the content
        this.users_project_book.forEach( item => {
            const project_item = document.createElement("div");

                const item_title =document.createElement("span");
                item_title.innerHTML = `<span>Project Name: </span><span>${item['title']}</span>`;
                item_title.classList.add("project_item_pair");
                project_item.appendChild( item_title );

                const item_due_date = document.createElement("span");
                item_due_date.innerHTML = `<span>Due date: </span><span>${item["due_date"]}</span>`;
                item_due_date.classList.add("project_item_pair");
                project_item.appendChild(item_due_date);

                const item_status = document.createElement("span");
                item_status.innerHTML = `<span>Status: </span><span>${item["status"]}</span>`;
                item_status.classList.add("project_item_pair");
                project_item.appendChild(item_status);

                const item_control_icon = document.createElement("span");

                item_control_icon.innerHTML =
                `<span class="project_view_icon">VIEW</span>
                <span class="project_edit_icon">EDIT</span>
                <span class="project_del_icon">DELETE</span>`;
                item_control_icon.classList.add("project_item_pair");
                project_item.appendChild(item_control_icon);

            project_item.classList.add("project_item");
            project_list.appendChild(project_item);

        });

        const delete_icons = document.querySelectorAll(".project_del_icon");
        delete_icons.forEach(item => item.addEventListener("click", this.delete_project) );

    }

    static delete_project(e){
        
        const target_element = e.target.parentNode;

        console.log(e.target);
        
        // const my_current_projects = this.users_project_book; won't work Here the scope of this has changed.
        
        const index_of_project_to_be_deleted = Project.find_target_project(target_element);
        // scripts.js:106 Uncaught TypeError: this.find_target_project is not a function
        // This is the same reason like the above. We call the function asynchronously


        Project.users_project_book.splice(index_of_project_to_be_deleted,1);
        Project.store_projects_locally();
        Project.display_projects();
    }
}

class Todo{

}


// Display the existing projects
Project.display_projects();
Project.add_listener();