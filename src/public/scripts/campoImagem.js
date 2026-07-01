const dropAreas = document.querySelectorAll(".file-drop-area");

dropAreas.forEach(area => {
    const input = area.querySelector(".file-input");
    const wrapper = area.querySelector(".previews-wrapper");
    const counterElement = area.querySelector("#numero-fotos-upada");
    
    // Create a DataTransfer to hold our files programmatically
    const dataTransfer = new DataTransfer();

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
        handleFiles(e.dataTransfer.files);
    });

    input.addEventListener("change", (e) => {
        handleFiles(input.files);
    });

    function handleFiles(files) {
        const isMultiple = input.hasAttribute('multiple');

        if (!isMultiple) {
            // For single inputs, replace the entire DataTransfer
            dataTransfer.items.clear();
            if (files.length > 0) {
                dataTransfer.items.add(files[0]);
            }
        } else {
            // For multiple inputs, add files up to the limit of 4
            for (let i = 0; i < files.length; i++) {
                if (dataTransfer.items.length >= 4) {
                    alert("Você pode enviar no máximo 4 imagens para o portfólio.");
                    break;
                }
                dataTransfer.items.add(files[i]);
            }
        }
        
        input.files = dataTransfer.files;
        renderPreviews();
    }

    function renderPreviews() {
        wrapper.innerHTML = "";
        
        // Update texts and icons visibility
        const msg = area.querySelector(".file-msg");
        const icon = area.querySelector(".upload-icon");
        
        if (dataTransfer.items.length > 0) {
            if (msg) msg.style.display = 'none';
            if (icon) icon.style.display = 'none';
        } else {
            if (msg) msg.style.display = 'block';
            if (icon) icon.style.display = 'block';
        }
        
        // Update counter if exists
        if (counterElement) {
            counterElement.textContent = dataTransfer.items.length;
        }

        Array.from(dataTransfer.files).forEach((file, index) => {
            const previewItem = document.createElement("div");
            previewItem.classList.add("preview-item", "image-loading");
            
            const img = document.createElement("img");
            
            const btnDelete = document.createElement("button");
            btnDelete.classList.add("btn-delete");
            btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
            // Previne que o click na lixeira ative o input de arquivo
            btnDelete.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFile(index);
            });
            
            previewItem.appendChild(img);
            previewItem.appendChild(btnDelete);
            wrapper.appendChild(previewItem);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setTimeout(() => {
                    img.src = e.target.result;
                    previewItem.classList.remove("image-loading");
                }, 500);
            };
            reader.readAsDataURL(file);
        });
    }

    function removeFile(indexToRemove) {
        const newDt = new DataTransfer();
        Array.from(dataTransfer.files).forEach((file, index) => {
            if (index !== indexToRemove) {
                newDt.items.add(file);
            }
        });
        
        // Update our reference dt
        dataTransfer.items.clear();
        Array.from(newDt.files).forEach(file => dataTransfer.items.add(file));
        
        input.files = dataTransfer.files;
        renderPreviews();
    }
});