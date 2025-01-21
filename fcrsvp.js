if (document.location.href.indexOf('6747880') > -1) {
    // Add CSS dynamically
    const style = document.createElement('style');
    style.innerHTML = `
.s-option {
    background: #c6e2e2;
    padding: 20px;
    border: solid 3px rgba(255, 255, 255, 0);
    cursor: pointer;
}
.s-title {
    font-size: 22px;
    font-weight: 700;
    color: #354d6e;
    margin-bottom: 5px;
}
.s-price {
    font-size: 30px;
    color: #354d6e;
    margin-bottom: 5px;
}
.s-info {
    color: #354d6e;
    margin-bottom: 5px;
    font-weight: 500;
}
.selected .s-option {
    border: solid 3px #354d6e;
}

#cid_3 .form-radio {
  display: none;
}
#cid_3 .form-single-column {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.form-radio-item.clear-left {
    width: 45%;
    margin: 10px;
}
.form-radio-item label  {
    height: 100% !important;
}
.form-radio-item label  span {
    height: 100% !important;
    display: flex;
}


@media screen and (max-width: 425px) {
.form-radio-item.clear-left {
    width: 100%;
    margin: 10px;
}
}
    `;
    document.head.appendChild(style);

    // Add JavaScript dynamically
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
        document.addEventListener("DOMContentLoaded", function () {
  // Data object containing the HTML content for each option
  const optionContent = {
    "VISIONARY": `
      <div class="s-option" id="visionary">
        <div class="s-title">VISIONARY</div>
        <div class="s-price">$50,000</div>
        <div class="s-info">Title sponsor of any Friendship Circle program of your choice for one year</div>
        <div class="s-info">Provide full scholarships to 14 families for 1 year</div>
        <div class="s-info">Name or company logo in all 2025 marketing</div>
        <div class="s-info">Recognition in social media, newsletters, events, and website</div>
        <div class="s-info">VIP check-in and hosted table for 10 guests</div>
        <div class="s-info">Diamond page in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name prominently displayed during the gala</div>
      </div>
    `,
    "CHAMPION": `
      <div class="s-option" id="champion">
        <div class="s-title">CHAMPION</div>
        <div class="s-price">$36,000</div>
        <div class="s-info">Sponsor for one year of Friends@Home in-home respite program for 40 children</div>
        <div class="s-info">Name or company logo in all 2025 marketing</div>
        <div class="s-info">Recognition in social media, newsletters, events, and website</div>
        <div class="s-info">VIP check-in and hosted table for 10 guests</div>
        <div class="s-info">Sapphire page in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name prominently displayed during the gala</div>
      </div>
    `,
    "PILLAR": `
      <div class="s-option" id="pillar">
        <div class="s-title">PILLAR</div>
        <div class="s-price">$20,000</div>
        <div class="s-info">Sponsor full scholarships to 15 children for our summer camp</div>
        <div class="s-info">Recognition in social media, newsletters, events, and website</div>
        <div class="s-info">VIP check-in and hosted table for 10 guests</div>
        <div class="s-info">Platinum page in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name prominently displayed during the gala</div>
      </div>
    `,
    "BUILDER": `
      <div class="s-option" id="builder">
        <div class="s-title">BUILDER</div>
        <div class="s-price">$10,000</div>
        <div class="s-info">Sponsor 60 children one day of our largest program, Sunday Circle</div>
        <div class="s-info">Recognition on Gala website</div>
        <div class="s-info">6 tickets to the 2025 Heroes Gala</div>
        <div class="s-info">Gold page in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name prominently displayed during the gala</div>
      </div>
    `,
    "PARTNER": `
      <div class="s-option" id="partner">
        <div class="s-title">PARTNER</div>
        <div class="s-price">$5,000</div>
        <div class="s-info">Sponsor one day of our largest program, Sunday Circle</div>
        <div class="s-info">Recognition on Gala website</div>
        <div class="s-info">6 tickets to the 2025 Heroes Gala</div>
        <div class="s-info">Gold page in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name prominently displayed during the gala</div>
      </div>
    `,
    "ADVOCATE": `
      <div class="s-option" id="advocate">
        <div class="s-title">ADVOCATE</div>
        <div class="s-price">$3,600</div>
        <div class="s-info">Sponsor full scholarship for one family for one year</div>
        <div class="s-info">Recognition on Gala website</div>
        <div class="s-info">4 tickets to the 2025 Heroes Gala</div>
        <div class="s-info">Silver page in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name listed on event materials</div>
      </div>
    `,
    "FRIEND": `
      <div class="s-option" id="friend">
        <div class="s-title">FRIEND</div>
        <div class="s-price">$1,800</div>
        <div class="s-info">Sponsor a Volunteer Education Workshop</div>
        <div class="s-info">2 tickets to the 2025 Heroes Gala</div>
        <div class="s-info">Bronze page in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name listed on event materials</div>
      </div>
    `,
    "BENEFACTOR": `
      <div class="s-option" id="benefactor">
        <div class="s-title">BENEFACTOR</div>
        <div class="s-price">$1,000</div>
        <div class="s-info">Sponsor 2 UMatter Meetups, our teen mental health program</div>
        <div class="s-info">2 tickets to the 2025 Heroes Gala</div>
        <div class="s-info">Half page ad in the 2025 Heroes Gala Journal</div>
        <div class="s-info">Name listed on event materials</div>
      </div>
    `
  };

  // Loop through each radio button and add the corresponding HTML content
  document.querySelectorAll('.form-radio-item').forEach(item => {
    const input = item.querySelector('input');
    const optionValue = input.value; // Get the value of the radio button (e.g., "VISIONARY")

    if (optionContent[optionValue]) {
      // Insert the corresponding HTML into the <span> of the label
      item.querySelector('label span').innerHTML = optionContent[optionValue];
    }

    // Add event listener to handle selection
    input.addEventListener('change', function () {
      // Remove .selected class from all options
      document.querySelectorAll('.form-radio-item').forEach(i => i.classList.remove('selected'));
      
      // Add .selected class to the currently selected option
      item.classList.add('selected');
    });
  });
});


// Define sponsor levels guest amounts
const sponsorLevels = {
  "VISIONARY": 10,
  "CHAMPION": 10,
  "PILLAR": 10,
  "BUILDER": 6,
  "PARTNER": 6,
  "ADVOCATE": 4,
  "FRIEND": 2,
  "BENEFACTOR": 2
};


  let numberOfGuestFieldsToShow = 0; // Keep track of how many guest fields should be shown
  let showResTyp = "no"; // Track whether to show reservation type fields ("yes" or "no")
 // Elements to show/hide based on sponsor/ticket logic
  const ticketFields = ["id_5", "id_8", "id_6"]; // IDs of fields to show/hide for ticket purchase




document.addEventListener("DOMContentLoaded", function () {
  // Define guest field sets with their corresponding form line IDs, individual field IDs, and notes
  
  
  
const guestFieldSets = [
  {
    note: "Guest #1",
    formLines: ["id_17", "id_19", "id_15", "id_16"],
    fields: {
      fullNameFirst: "first_19",
      fullNameLast: "last_19",
      email: "input_15",
      reservationType: "input_16"
    }
  },
  {
    note: "Guest #2",
    formLines: ["id_18", "id_14", "id_20", "id_21"],
    fields: {
      fullNameFirst: "first_14",
      fullNameLast: "last_14",
      email: "input_20",
      reservationType: "input_21"
    }
  },
  {
    note: "Guest #3",
    formLines: ["id_22", "id_23", "id_24", "id_25"],
    fields: {
      fullNameFirst: "first_23",
      fullNameLast: "last_23",
      email: "input_24",
      reservationType: "input_25"
    }
  },
  {
    note: "Guest #4",
    formLines: ["id_26", "id_31", "id_28", "id_29"],
    fields: {
      fullNameFirst: "first_31",
      fullNameLast: "last_31",
      email: "input_28",
      reservationType: "input_29"
    }
  },
  {
    note: "Guest #5",
    formLines: ["id_30", "id_27", "id_32", "id_33"],
    fields: {
      fullNameFirst: "first_27",
      fullNameLast: "last_27",
      email: "input_32",
      reservationType: "input_33"
    }
  },
  {
    note: "Guest #6",
    formLines: ["id_34", "id_35", "id_36", "id_37"],
    fields: {
      fullNameFirst: "first_35",
      fullNameLast: "last_35",
      email: "input_36",
      reservationType: "input_37"
    }
  },
  {
    note: "Guest #7",
    formLines: ["id_38", "id_39", "id_40", "id_41"],
    fields: {
      fullNameFirst: "first_39",
      fullNameLast: "last_39",
      email: "input_40",
      reservationType: "input_41"
    }
  },
  {
    note: "Guest #8",
    formLines: ["id_43", "id_44", "id_45", "id_46"],
    fields: {
      fullNameFirst: "first_44",
      fullNameLast: "last_44",
      email: "input_45",
      reservationType: "input_46"
    }
  },
  {
    note: "Guest #9",
    formLines: ["id_47", "id_48", "id_49", "id_50"],
    fields: {
      fullNameFirst: "first_48",
      fullNameLast: "last_48",
      email: "input_49",
      reservationType: "input_50"
    }
  },
  {
    note: "Guest #10",
    formLines: ["id_51", "id_52", "id_53", "id_54"],
    fields: {
      fullNameFirst: "first_52",
      fullNameLast: "last_52",
      email: "input_53",
      reservationType: "input_54"
    }
  },
  {
    note: "Guest #11",
    formLines: ["id_55", "id_56", "id_57", "id_58"],
    fields: {
      fullNameFirst: "first_56",
      fullNameLast: "last_56",
      email: "input_57",
      reservationType: "input_58"
    }
  }
];


 // Hide or show a form line by its ID
  function toggleFormLine(id, show) {
    const formLine = document.getElementById(id);
    if (formLine) {
      formLine.style.display = show ? "block" : "none";
      console.log(`${show ? "Displayed" : "Hid"} form line: ${id}`);
    } else {
      console.error(`Error: Form line with ID ${id} not found!`);
    }
  }

  // Hide all guest field sets and set placeholder values
  function hideAllGuestFields() {
    console.log("Hiding all guest fields and setting placeholder values...");
    guestFieldSets.forEach(set => {
      set.formLines.forEach(lineId => {
        toggleFormLine(lineId, false);
      });

      for (const fieldName in set.fields) {
        const fieldId = set.fields[fieldName];
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
          fieldElement.value = ".";
          console.log(`Set placeholder for field: ${fieldId}`);
        } else {
          console.error(`Error: Field with ID ${fieldId} not found!`);
        }
      }
    });
  }

  // Show the required number of guest field sets
  function showGuestFields(number) {
    console.log(`Showing ${number} guest field sets with Reservation Type: ${showResTyp}`);
    hideAllGuestFields(); // Hide all fields first
    for (let i = 0; i < number; i++) {
      const set = guestFieldSets[i];
      if (!set) {
        console.error(`Error: No guest field set found for index ${i}`);
        continue;
      }

      set.formLines.forEach(lineId => {
        toggleFormLine(lineId, true);
      });

      for (const fieldName in set.fields) {
        const fieldId = set.fields[fieldName];
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
          if (fieldName === "reservationType") {
            if (showResTyp === "yes") {
              document.getElementById(set.formLines[3]).style.display = "block"; // Show reservation type form line
              fieldElement.value = ""; // Clear placeholder
              console.log(`Displayed and cleared reservation type field: ${fieldId}`);
            } else {
              document.getElementById(set.formLines[3]).style.display = "none"; // Keep reservation type hidden
              fieldElement.value = "."; // Set placeholder
              console.log(`Hid reservation type field and set placeholder: ${fieldId}`);
            }
          } else {
            fieldElement.value = ""; // Clear placeholder for visible fields
            console.log(`Cleared placeholder for field: ${fieldId}`);
          }
        } else {
          console.error(`Error: Field with ID ${fieldId} not found!`);
        }
      }
    }
  }

  // Handle sponsor radio button changes
  const sponsorRadios = document.querySelectorAll('input[name="q3_input3"]');
  const sponsorCheckbox = document.querySelector('#input_61_0');
  if (sponsorRadios.length > 0 && sponsorCheckbox) {
    sponsorRadios.forEach(radio => {
      radio.addEventListener("change", function () {
        console.log(`Sponsor level updated: ${this.value}`);
        numberOfGuestFieldsToShow = 0; // Reset guest fields count
        sponsorCheckbox.checked = false; // Uncheck the checkbox
        hideAllGuestFields(); // Hide all guest fields
      });
    });

    sponsorCheckbox.addEventListener("change", function () {
      if (this.checked) {
        const selectedSponsor = Array.from(sponsorRadios).find(radio => radio.checked)?.value;
        console.log(`Checkbox checked, sponsor level is: ${selectedSponsor}`);
        if (sponsorLevels[selectedSponsor] !== undefined) {
          numberOfGuestFieldsToShow = sponsorLevels[selectedSponsor]; // Update guest fields based on sponsor
          showResTyp = "no"; // Reservation Type fields should remain hidden
          showGuestFields(numberOfGuestFieldsToShow);
        } else {
          console.error("Error: No valid sponsor level selected!");
        }
      } else {
        console.log("Checkbox unchecked. Resetting guest fields.");
        numberOfGuestFieldsToShow = 0; // Reset guest fields count
        hideAllGuestFields();
      }
    });
  } else {
    console.error("Error: Sponsor radios or checkbox not found!");
  }

  // Handle number of seats dropdown changes
  const seatDropdown = document.querySelector("#input_6");
  if (seatDropdown) {
    seatDropdown.addEventListener("change", function () {
      const numberOfSeats = parseInt(this.value);
      console.log(`Number of seats selected: ${numberOfSeats}`);
      if (!isNaN(numberOfSeats) && numberOfSeats > 0 && numberOfSeats <= guestFieldSets.length) {
        numberOfGuestFieldsToShow = numberOfSeats; // Reset the number based on seats
        showResTyp = "yes"; // Set to "yes" for seat selection
        showGuestFields(numberOfGuestFieldsToShow);
      } else {
        console.error(`Invalid number of seats selected: ${this.value}`);
        hideAllGuestFields(); // Hide all fields if invalid number
      }
    });
  } else {
    console.error("Error: Dropdown with ID #input_6 not found!");
  }

  // Handle "I would like to..." field changes
  const actionRadios = document.querySelectorAll('input[name="q59_input59"]');
  if (actionRadios.length > 0) {
    actionRadios.forEach(radio => {
      radio.addEventListener("change", function () {
        console.log(`Action field updated: ${this.value}`);
        numberOfGuestFieldsToShow = 0; // Reset the number of guest fields to 0
        hideAllGuestFields(); // Ensure all fields are hidden

        // Show or hide form line #id_76 based on the selected option
        toggleFormLine("id_76", this.value === "Sponsor");
      });
    });
  } else {
    console.error("Error: No action radio buttons found!");
  }

  // Handle "Ad in the gala journal" checkbox changes
  const adCheckbox = document.querySelector("#input_60_0");
  if (adCheckbox) {
    adCheckbox.addEventListener("change", function () {
      console.log(`Checkbox for gala journal ad is now: ${this.checked ? "checked" : "unchecked"}`);
      // Show or hide form line #id_73 based on checkbox state
      toggleFormLine("id_73", this.checked);
    });
  } else {
    console.error("Error: Gala journal ad checkbox not found!");
  }

  // Initialize by hiding all fields and conditional elements
  hideAllGuestFields();
  toggleFormLine("id_76", false); // Initially hide #id_76
  toggleFormLine("id_73", false); // Initially hide #id_73
});
    `;
    document.body.appendChild(script);
}
