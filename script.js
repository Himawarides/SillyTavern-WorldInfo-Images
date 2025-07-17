class WorldInfoImageExtension {
    async onLoad() {
        this.patchWorldInfoFunctions();
        this.addStyles();
    }

    patchWorldInfoFunctions() {
        // Save original functions
        this.originalWorldInfoEntryTemplate = window.world_info.worldInfoEntryTemplate;
        this.originalParseWorldInfoEntry = window.world_info.parseWorldInfoEntry;
        this.originalFormatWorldInfo = window.world_info.formatWorldInfo;

        // Patch template to include image field
        window.world_info.worldInfoEntryTemplate = (entry) => {
            let html = this.originalWorldInfoEntryTemplate(entry);
            const imageRow = `
                <tr>
                    <td>Image URL</td>
                    <td>
                        <input type="text" class="world_info_image" 
                            placeholder="https://example.com/image.jpg" 
                            value="${entry.image || ''}">
                        <div class="world_info_image_preview">
                            ${entry.image ? `<img src="${entry.image}">` : ''}
                        </div>
                    </td>
                </tr>
            `;
            return html.replace('</table>', imageRow + '</table>');
        };

        // Patch parser to handle image field
        window.world_info.parseWorldInfoEntry = (element) => {
            const entry = this.originalParseWorldInfoEntry(element);
            entry.image = element.querySelector('.world_info_image').value || '';
            return entry;
        };

        // Patch formatter to include image reference
        window.world_info.formatWorldInfo = (entry) => {
            let text = this.originalFormatWorldInfo(entry);
            if (entry.image) {
                text += `\n[Image: ${entry.image}]`;
            }
            return text;
        };
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .world_info_image_preview {
                margin-top: 10px;
            }
            .world_info_image_preview img {
                max-width: 200px;
                max-height: 200px;
                border-radius: 4px;
                border: 1px solid var(--border-color);
            }
        `;
        document.head.appendChild(style);
    }
}

SillyTavern.registerExtension(new WorldInfoImageExtension());
