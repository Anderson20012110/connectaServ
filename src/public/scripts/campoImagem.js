const dropAreas = document.querySelectorAll(".file-drop-area");

dropAreas.forEach(area => {

    const input = area.querySelector(".file-input");
    const preview = area.querySelector(".preview-img");

    area.addEventListener("dragover", (e) => {
        e.preventDefault();
        area.classList.add("drag-over");
    });

    area.addEventListener("dragleave", () => {
        area.classList.remove("drag-over");
    });

    area.addEventListener("drop", (e) => {
        e.preventDefault();

        area.classList.remove("drag-over");

        const file = e.dataTransfer.files[0];

        if(file){
            input.files = e.dataTransfer.files;
            carregarPreview(file, area, preview);
        }
    });

    input.addEventListener("change", () => {
        if(input.files[0]){
            carregarPreview(input.files[0], area, preview);
        }
    });

});