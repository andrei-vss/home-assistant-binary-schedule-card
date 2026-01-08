class BinaryScheduleCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define a text entity with size 168 or bigger");
    }
    this.config = config;
  }

  getCardSize() {
    return 8;
  }

  set hass(hass) {
    this._hass = hass;

    const entityId = this.config.entity;
    const stateObj = hass.states[entityId];
    let binary = stateObj?.state ?? "";

    const isValid = typeof binary === "string" && binary.length === 168;

    if (!isValid) {
      console.warn(`BinaryScheduleCard: invalid or missing state for ${entityId}. Setting default 168 zeros.`);
      binary = "0".repeat(168);

      // Set default value in Home Assistant
      this._hass.callService("input_text", "set_value", {
        entity_id: entityId,
        value: binary,
      });
    }

    this.render(binary);
  }


  render(binary) {
    this.innerHTML = "";

    const card = document.createElement("ha-card");
    card.header = this.config.title || undefined;

    const style = document.createElement("style");
    style.textContent = `

    .binary-clear-all {
        margin: 10px auto 5px auto;
        padding: 6px 12px;
        width: fit-content;
        background: #444;
        color: #fff;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
        transition: filter 0.2s ease;
      }

      .binary-clear-all:hover {
        filter: brightness(1.2);
      }

      .binary-table {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-right: 8px; 
        margin-bottom: 8px; 
        margin-left: 4px; 
        margin-top: 8px; 
      }

      .binary-row {
        display: grid;
        grid-template-columns: 40px repeat(7, minmax(20px, 1fr));
        gap: 3px;
      }

      .binary-cell {
        padding: 4px 2px;
        font-size: 10px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        transition: background 0.2s ease;
      }

      .binary-cell:not(.binary-header):not(.binary-hour):hover {
        filter: brightness(1.15);
      }

      .binary-header {
        font-weight: bold;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .binary-hour {
        background: var(--card-background-color);
        color: var(--secondary-text-color);
      }

      .on {
        background: #e0e0e0; /* gri deschis */
        color: var(--primary-text-color);
      }

      .off {
        background: #5f5f5f; /* gri închis */
        color: var(--primary-text-color);
      }

    `;
    card.appendChild(style);

    const container = document.createElement("div");
    container.className = "binary-table";

    const days = ["L", "M", "Mi", "J", "V", "S", "D"];

    // Header row
    const headerRow = document.createElement("div");
    headerRow.className = "binary-row";

    const corner = document.createElement("div");
    corner.className = "binary-cell binary-header";
    headerRow.appendChild(corner);

    for (let d = 0; d < 7; d++) {
      const h = document.createElement("div");
      h.className = "binary-cell binary-header";
      h.textContent = days[d];
      headerRow.appendChild(h);
    }

    container.appendChild(headerRow);

    // 24 rows (hours)
    for (let hour = 0; hour < 24; hour++) {
      const row = document.createElement("div");
      row.className = "binary-row";

      const hourCell = document.createElement("div");
      hourCell.className = "binary-cell binary-hour";
      hourCell.textContent = `${hour}:00`;
      row.appendChild(hourCell);

      for (let day = 0; day < 7; day++) {
        const index = hour * 7 + day;
        const bit = binary[index] === "1";

        const cell = document.createElement("div");
        cell.className = "binary-cell " + (bit ? "on" : "off");
        cell.dataset.index = index;

        cell.addEventListener("click", () => this.toggle(index, binary));

        row.appendChild(cell);
      }

      container.appendChild(row);
    }
    
    card.appendChild(container);
    // Clear All button
    const clearBtn = document.createElement("div");
    clearBtn.className = "binary-clear-all";
    clearBtn.textContent = "Clear All";

    clearBtn.addEventListener("click", () => this.clearAll(binary));

    card.appendChild(clearBtn);


    this.appendChild(card);
  }

  clearAll() {
    const newBinary = "0".repeat(168);
    this._hass.callService("input_text", "set_value", {
      entity_id: this.config.entity,
      value: newBinary,
    });
  }


  toggle(index, binary) {
    const arr = binary.split("");
    arr[index] = arr[index] === "1" ? "0" : "1";
    const newBinary = arr.join("");

    this._hass.callService("input_text", "set_value", {
      entity_id: this.config.entity,
      value: newBinary,
    });
  }
}

customElements.define("binary-schedule-card", BinaryScheduleCard);

// Make card appear in Lovelace editor card picker:
window.customCards = window.customCards || [];
window.customCards.push({
  type: "binary-schedule-card",
  name: "binary Schedule Card",
  preview: true,
  description: "Weekly schedule grid — toggle hours for each day",
});