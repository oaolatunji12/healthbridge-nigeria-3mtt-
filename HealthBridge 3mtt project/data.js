const states = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
    "Yobe", "Zamfara"
];

const languages = ["English", "Yoruba", "Igbo", "Hausa"];

const symptomsBase = [
    { name: "Malaria", category: "Infectious" },
    { name: "Diarrhoea/Typhoid", category: "Waterborne", alertTrigger: "Cholera Alert" },
    { name: "Cold/Pneumonia", category: "Respiratory" },
    { name: "Lassa Fever", category: "Viral Hemorrhagic", alertTrigger: "Lassa Fever Warning" },
    { name: "BP & Stroke", category: "Non-Communicable" },
    { name: "Diabetes", category: "Non-Communicable" },
    { name: "Cancers", category: "Non-Communicable" },
    { name: "Mental Health", category: "Psychological" },
    { name: "Emergency Signs", category: "Emergency" }
];

// Generate exactly 100 mock reports
function generateMockData() {
    const data = [];
    const now = new Date();
    
    // Inject some natural clustering for the dashboard features
    // We want a Lassa Fever spike in Edo/Ondo and Cholera spike in Bauchi/Kano
    
    for (let i = 0; i < 100; i++) {
        // Bias states slightly for clusters
        let state;
        let symptomObj;
        let isCluster = false;
        
        if (i < 15) {
            // Lassa cluster
            state = Math.random() > 0.5 ? "Edo" : "Ondo";
            symptomObj = symptomsBase.find(s => s.name === "Lassa Fever");
            isCluster = true;
        } else if (i < 30) {
            // Cholera (Diarrhoea) cluster
            state = Math.random() > 0.5 ? "Bauchi" : "Kano";
            symptomObj = symptomsBase.find(s => s.name === "Diarrhoea/Typhoid");
            isCluster = true;
        } else {
            // Random distribution
            state = states[Math.floor(Math.random() * states.length)];
            symptomObj = symptomsBase[Math.floor(Math.random() * symptomsBase.length)];
        }

        const language = languages[Math.floor(Math.random() * languages.length)];
        
        // Random time within the last 24 hours
        const timeOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000);
        const timestamp = new Date(now.getTime() - timeOffset);
        
        // Alert status
        let status = "Routine";
        if (["Lassa Fever", "Emergency Signs"].includes(symptomObj.name)) {
            status = "Critical";
        } else if (symptomObj.name === "Diarrhoea/Typhoid") {
            status = Math.random() > 0.5 ? "Warning" : "Routine";
        }

        data.push({
            id: `HB-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`,
            state: state,
            language: language,
            symptom: symptomObj.name,
            category: symptomObj.category,
            timestamp: timestamp.toISOString(),
            status: status,
            isCluster: isCluster,
            alertTrigger: symptomObj.alertTrigger || null
        });
    }

    // Sort by timestamp descending (newest first)
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

const mockReports = generateMockData();

// USSD Menu Definitions
const ussdMenus = {
    "start": {
        text: "Welcome to HealthBridge Nigeria\nSelect Language / Yan Ede / Họrọ Asụsụ / Zabi Yare:\n1. English\n2. Yoruba\n3. Igbo\n4. Hausa",
        options: {
            "1": "en_main",
            "2": "yo_main",
            "3": "ig_main",
            "4": "ha_main"
        }
    },
    // ENGLISH MENUS
    "en_main": {
        text: "MAIN MENU:\n1. Prevent Diseases\n2. Emergency Signs\n3. Child Health\n4. Immunization & Vaccination\n0. Exit",
        options: { "1": "en_prevent", "2": "en_emergency", "3": "en_child", "4": "en_immunize", "0": "exit" }
    },
    "en_prevent": {
        text: "PREVENT DISEASES:\n1. Malaria\n2. Diarrhoea/Typhoid\n3. Cold/Pneumonia\n4. Lassa Fever\n5. BP & Stroke\n6. Diabetes\n7. Cancers\n8. Mental Health\n0. Back  00. Main Menu",
        options: { "1": "en_malaria", "2": "en_diarrhoea", "3": "en_cold", "4": "en_lassa", "5": "en_bp", "6": "en_diabetes", "7": "en_cancer", "8": "en_mental", "0": "en_main", "00": "en_main" }
    },
    "en_malaria": {
        text: "MALARIA:\n1. Causes\n2. Symptoms\n3. Prevention\n4. Treatment\n5. When to Visit Hospital\n0. Back  00. Main Menu",
        options: { 
            "1": { text: "Causes: Bite from infected mosquito.\n0. Back", options: { "0": "en_malaria" } },
            "2": { text: "Symptoms: Fever, headache, chills, body weakness.\n0. Back", options: { "0": "en_malaria" } },
            "3": { text: "Prevention: Sleep under mosquito net. Clear stagnant water. Use mosquito repellent.\n0. Back", options: { "0": "en_malaria" } },
            "4": { text: "Treatment: Test before treatment. Use approved malaria drugs.\n0. Back", options: { "0": "en_malaria" } },
            "5": { text: "Hospital Limit: Fever >24hrs? Visit nearest health center.", sms: "If fever lasts more than 24 hours, visit the nearest health center immediately for malaria testing.", options: { "0": "en_malaria" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_diarrhoea": {
        text: "DIARRHOEA & TYPHOID:\n1. Causes\n2. Symptoms\n3. Prevention\n4. ORS Treatment\n5. Hospital Visit\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Causes: Dirty water and poor hygiene.\n0. Back", options: { "0": "en_diarrhoea" } },
            "2": { text: "Symptoms: Frequent stool, vomiting, fever, stomach pain.\n0. Back", options: { "0": "en_diarrhoea" } },
            "3": { text: "Prevention: Drink clean water. Wash hands often. Eat well-cooked food.\n0. Back", options: { "0": "en_diarrhoea" } },
            "4": { text: "ORS Treatment: Mix ORS with clean water. Drink often to avoid dehydration.\n0. Back", options: { "0": "en_diarrhoea" } },
            "5": { text: "Hospital: Blood in stool or weakness? Go to hospital immediately.", sms: "Blood in stool or extreme weakness observed. Go to the hospital immediately.", options: { "0": "en_diarrhoea" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_cold": {
        text: "COLD & PNEUMONIA:\n1. Causes\n2. Symptoms\n3. Prevention\n4. Treatment\n5. Danger Signs\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Causes: Viral or bacterial infection.\n0. Back", options: { "0": "en_cold" } },
            "2": { text: "Symptoms: Cough, fever, runny nose, chest discomfort.\n0. Back", options: { "0": "en_cold" } },
            "3": { text: "Prevention: Wash hands often. Avoid sick people. Cover mouth when coughing.\n0. Back", options: { "0": "en_cold" } },
            "4": { text: "Treatment: Rest and drink warm fluids. Visit clinic if not improving.\n0. Back", options: { "0": "en_cold" } },
            "5": { text: "Danger Signs: Fast breathing or chest pain? Child struggling to breathe? Go to hospital now.", sms: "Danger Sign: Fast breathing/chest pain. Go to the hospital NOW.", options: { "0": "en_cold" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_lassa": {
        text: "LASSA FEVER:\n1. Causes\n2. Symptoms\n3. Prevention\n4. Treatment\n5. When to Visit Hospital\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Causes: Food contaminated by rat urine or droppings.\n0. Back", options: { "0": "en_lassa" } },
            "2": { text: "Symptoms: Fever, weakness, headache, bleeding in severe cases.\n0. Back", options: { "0": "en_lassa" } },
            "3": { text: "Prevention: Store food well. Keep home clean. Avoid rats.\n0. Back", options: { "0": "en_lassa" } },
            "4": { text: "Treatment: Early hospital care improves survival. Do not self-medicate.\n0. Back", options: { "0": "en_lassa" } },
            "5": { text: "Hospital: Fever + rat exposure? Go to hospital immediately.", sms: "Lassa Warning: Fever + rat exposure. Go to hospital immediately.", options: { "0": "en_lassa" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_bp": {
        text: "BP & STROKE:\n1. Risk Factors\n2. Symptoms\n3. Prevention\n4. Healthy Tips\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Risk Factors: High salt diet, obesity, smoking, no exercise.\n0. Back", options: { "0": "en_bp" } },
            "2": { text: "Symptoms: Headache, dizziness, chest pain or none.\n0. Back", options: { "0": "en_bp" } },
            "3": { text: "Prevention: Check BP regularly. Exercise and eat healthy.\n0. Back", options: { "0": "en_bp" } },
            "4": { text: "Healthy Tips: Reduce salt, stay active. Check BP every 6 months.", sms: "Health Tip: Reduce salt, stay active. Check BP every 6 months.", options: { "0": "en_bp" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_diabetes": {
        text: "DIABETES:\n1. Causes\n2. Symptoms\n3. Prevention\n4. Management\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Causes: Family history, obesity, insulin problems.\n0. Back", options: { "0": "en_diabetes" } },
            "2": { text: "Symptoms: Frequent urination, thirst, tiredness.\n0. Back", options: { "0": "en_diabetes" } },
            "3": { text: "Prevention: Eat healthy, exercise, maintain weight.\n0. Back", options: { "0": "en_diabetes" } },
            "4": { text: "Management: Check blood sugar often. Visit clinic regularly.", sms: "Health Tip: Check blood sugar often. Visit clinic regularly.", options: { "0": "en_diabetes" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_cancer": {
        text: "CANCERS:\n1. Types\n2. Symptoms\n3. Prevention\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Types: Breast, cervical, prostate cancer.\n0. Back", options: { "0": "en_cancer" } },
            "2": { text: "Symptoms: Lumps, bleeding, weight loss.\n0. Back", options: { "0": "en_cancer" } },
            "3": { text: "Prevention: Screening and vaccines help. Early detection saves lives.", sms: "Cancer Prevention: Screening and vaccines help. Early detection saves lives.", options: { "0": "en_cancer" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_mental": {
        text: "MENTAL HEALTH:\n1. Causes\n2. Symptoms\n3. Support\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Causes: Stress, trauma, life pressure.\n0. Back", options: { "0": "en_mental" } },
            "2": { text: "Symptoms: Sadness, worry, loss of interest.\n0. Back", options: { "0": "en_mental" } },
            "3": { text: "Support: Talk to someone you trust. Visit a health provider. Help is available.", sms: "Mental Health: Talk to someone you trust. Visit a health provider. Help is available.", options: { "0": "en_mental" } },
            "0": "en_prevent", "00": "en_main"
        }
    },
    "en_emergency": {
        text: "EMERGENCY SIGNS:\nSevere bleeding, breathing difficulty, unconsciousness, convulsions. Go to hospital NOW.",
        sms: "EMERGENCY: Go to the hospital NOW if experiencing severe bleeding, breathing difficulty, or convulsions.",
        options: { "0": "en_main" }
    },
    "en_child": {
        text: "CHILD HEALTH:\n1. Breastfeeding\n2. Nutrition\n3. Danger Signs\n0. Back  00. Main Menu",
        options: {
            "1": { text: "Breastfeeding: Exclusive for 6 months.\n0. Back", options: { "0": "en_child" } },
            "2": { text: "Nutrition: Start healthy family foods after 6 months.\n0. Back", options: { "0": "en_child" } },
            "3": { text: "Danger Signs: Not feeding, vomiting, fever, fast breathing. Go to hospital.\n0. Back", options: { "0": "en_child" } },
            "0": "en_main", "00": "en_main"
        }
    },
    "en_immunize": {
        text: "IMMUNIZATION & VACCINATION:\nProtects against diseases. Follow schedule at health center. HPV, measles, polio vaccines save lives.\n0. Back  00. Main Menu",
        options: { "0": "en_main", "00": "en_main" }
    },
    
    // YORUBA MENUS
    "yo_main": {
        text: "AKỌKỌ AKOJO:\n1. Idaabobo Arun\n2. Ami Pajawiri\n3. Ilera Omode\n4. Igbese ajesara\n0. Jade",
        options: { "1": "yo_prevent", "2": "yo_emergency", "3": "yo_child", "4": "yo_immunize", "0": "exit" }
    },
    "yo_prevent": {
        text: "IDAABOBO ARUN:\n1. Malaria\n2. Itoju atogbon/Taifod\n3. Otutu/Pneumonia\n4. Lassa Fever\n5. Ifunpa giga ati eje riru\n6. Atosi\n7. Arun jejere\n8. Ilera opolo\n0. Pada  00. Akoko akojo",
        options: { "1": "yo_malaria", "2": "yo_diarrhoea", "3": "yo_cold", "4": "yo_lassa", "5": "yo_bp", "6": "yo_diabetes", "7": "yo_cancer", "8": "yo_mental", "0": "yo_main", "00": "yo_main" }
    },
    "yo_malaria": {
        text: "MALARIA:\n1. Ki niyen fa\n2. Aami\n3. Idaabobo\n4. Itoju\n5. Nigba wo ni lati lo si ile iwosan\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Causes: Ibon ankope to ni arun.\n0. Pada", options: { "0": "yo_malaria" } },
            "2": { text: "Symptoms: Ibanuje, irora ori, otutu, ailera.\n0. Pada", options: { "0": "yo_malaria" } },
            "3": { text: "Prevention: Sun ni abe apoti ankope. Nu omi ti ko tii ro. Lo olufoo ankope.\n0. Pada", options: { "0": "yo_malaria" } },
            "4": { text: "Treatment: Se idanwo ki o to mu ogede. Lo awon oogun malaria to peye.\n0. Pada", options: { "0": "yo_malaria" } },
            "5": { text: "Hospital: Ti ibanuje ba pe ju wakati 24 lo, lo ile iwosan to sunmo lesekese.", sms: "Ti ibanuje ba pe ju wakati 24 lo, lo ile iwosan to sunmo lesekese fun idanwo malaria.", options: { "0": "yo_malaria" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_diarrhoea": {
        text: "DIARRHOEA & TYPHOID:\n1. Ki niyen fa\n2. Aami\n3. Idaabobo\n4. Itoju ORS\n5. Lo si ile iwosan\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Causes: Omi idoti ati aini imototo.\n0. Pada", options: { "0": "yo_diarrhoea" } },
            "2": { text: "Symptoms: Ailera, itoju omi, ibanuje, irora ikun.\n0. Pada", options: { "0": "yo_diarrhoea" } },
            "3": { text: "Prevention: Mu omi mimu. We owo nigbagbogbo. Jeun onje to dara.\n0. Pada", options: { "0": "yo_diarrhoea" } },
            "4": { text: "ORS Treatment: Da ORS si omi mimo. Mu nigbagbogbo lati dena dehydration.\n0. Pada", options: { "0": "yo_diarrhoea" } },
            "5": { text: "Hospital: Itoju omi eje tabi ailera? Lo si ile iwosan lesekese.", sms: "Itoju omi eje tabi ailera? Lo si ile iwosan lesekese.", options: { "0": "yo_diarrhoea" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_cold": {
        text: "COLD & PNEUMONIA:\n1. Ki niyen fa\n2. Aami\n3. Idaabobo\n4. Itoju\n5. Aami Pataki\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Causes: Arun kokoro tabi virus.\n0. Pada", options: { "0": "yo_cold" } },
            "2": { text: "Symptoms: Atoju, ibanuje, imu omi, irora aya.\n0. Pada", options: { "0": "yo_cold" } },
            "3": { text: "Prevention: We owo nigbagbogbo. Yago fun eni to ni arun. Bo enu nigba ti o nku.\n0. Pada", options: { "0": "yo_cold" } },
            "4": { text: "Treatment: Sinmi, mu omi gbona. Lo si ile-iwosan ti ko ba dara.\n0. Pada", options: { "0": "yo_cold" } },
            "5": { text: "Danger Signs: Mimu ni kiakia tabi irora aya? Omo nira lati simi? Lo si ile-iwosan lesekese.", sms: "Mimu ni kiakia tabi irora aya? Omo nira lati simi? Lo si ile-iwosan lesekese.", options: { "0": "yo_cold" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_lassa": {
        text: "LASSA FEVER:\n1. Ki niyen fa\n2. Aami\n3. Idaabobo\n4. Itoju\n5. Nigba wo ni lati lo si ile iwosan\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Causes: Ounje ti awon ore kiiki ati idoti obo.\n0. Pada", options: { "0": "yo_lassa" } },
            "2": { text: "Symptoms: Ibanuje, alaini agbara, irora ori, eje ninu awon oran to se pataki.\n0. Pada", options: { "0": "yo_lassa" } },
            "3": { text: "Prevention: Toju ounje daradara. Mo ile. Yago fun erin.\n0. Pada", options: { "0": "yo_lassa" } },
            "4": { text: "Treatment: Se itoju ile-iwosan ni kutukutu. Ma se oogun ara re.\n0. Pada", options: { "0": "yo_lassa" } },
            "5": { text: "Hospital: Ibanuje + ri erin? Lo ile-iwosan lesekese.", sms: "Ibanuje + ri erin? Lo ile-iwosan lesekese.", options: { "0": "yo_lassa" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_bp": {
        text: "IFUNPA GIGA ATI EJE RIRU:\n1. Awon ewu\n2. Aami\n3. Idaabobo\n4. Imoran Ilera\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Risk Factors: Ounje iyo pupo, sanra, taba, aini idaraya.\n0. Pada", options: { "0": "yo_bp" } },
            "2": { text: "Symptoms: Irora ori, dizziness, irora aya tabi ko si.\n0. Pada", options: { "0": "yo_bp" } },
            "3": { text: "Prevention: Sayewo BP nigbagbogbo. Se idaraya ati jeun ilera.\n0. Pada", options: { "0": "yo_bp" } },
            "4": { text: "Healthy Tips: Din iyo, je alaga, sayewo BP gbogbo osu mefa.", sms: "Din iyo, je alaga, Sayewo BP gbogbo osu mefa.", options: { "0": "yo_bp" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_diabetes": {
        text: "ATOSI (DIABETES):\n1. Ki niyen fa\n2. Aami\n3. Idaabobo\n4. Itoju\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Causes: Itan ebi, sanra, isoro insulin.\n0. Pada", options: { "0": "yo_diabetes" } },
            "2": { text: "Symptoms: Itewon omi nigbagbogbo, ibanuje, rire.\n0. Pada", options: { "0": "yo_diabetes" } },
            "3": { text: "Prevention: Jeun ilera, idaraya, pa iwuwo deede.\n0. Pada", options: { "0": "yo_diabetes" } },
            "4": { text: "Management: Sayewo suga ninu eje nigbagbogbo. Lo si ile-iwosan.", sms: "Sayewo suga ninu eje nigbagbogbo. Lo si ile-iwosan.", options: { "0": "yo_diabetes" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_cancer": {
        text: "ARUN JEJERE:\n1. Iru Arun\n2. Aami\n3. Idaabobo\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Types: Jejere oyan, jejere ileomo, jejere ileomo okunrin.\n0. Pada", options: { "0": "yo_cancer" } },
            "2": { text: "Symptoms: Apo, eje, pipadanu iwuwo.\n0. Pada", options: { "0": "yo_cancer" } },
            "3": { text: "Prevention: Iwadii ati ajesara ran lowo. Wiwa kutukutu n pa aye.", sms: "Iwadii ati ajesara ran lowo. Wiwa kutukutu n pa aye.", options: { "0": "yo_cancer" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_mental": {
        text: "ILERA OPOLO:\n1. Ki niyen fa\n2. Aami\n3. Itosona\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Causes: Ipalara, wahala aye, wahala opolo.\n0. Pada", options: { "0": "yo_mental" } },
            "2": { text: "Symptoms: Ibanuje, iberu, aini ife si ohun.\n0. Pada", options: { "0": "yo_mental" } },
            "3": { text: "Support: Ba enikan soro ti o gbekele. Lo si alagbawo ilera. Iranlowo wa.", sms: "Ba enikan soro ti o gbekele. Lo si alagbawo ilera. Iranlowo wa.", options: { "0": "yo_mental" } },
            "0": "yo_prevent", "00": "yo_main"
        }
    },
    "yo_emergency": {
        text: "AMI PAJAWIRI:\nAilera to po, isoro mimi, alainisokan, ijiya. Lo ile-iwosan lesekese.",
        sms: "AMI PAJAWIRI: Ailera to po, isoro mimi, alainisokan, ijiya. Lo ile-iwosan lesekese.",
        options: { "0": "yo_main" }
    },
    "yo_child": {
        text: "ILERA OMODE:\n1. Mimu wara\n2. Ijeun\n3. Aami Pataki\n0. Pada  00. Akoko akojo",
        options: {
            "1": { text: "Breastfeeding: Wara nikan fun osu mefa.\n0. Pada", options: { "0": "yo_child" } },
            "2": { text: "Nutrition: Bere ounje ilera ebi leyin osu mefa.\n0. Pada", options: { "0": "yo_child" } },
            "3": { text: "Danger Signs: Aijeun, eebi, otutu, mimi kiakia. Lo ile-iwosan.\n0. Pada", options: { "0": "yo_child" } },
            "0": "yo_main", "00": "yo_main"
        }
    },
    "yo_immunize": {
        text: "IGBESE AJESARA:\nDaabobo lodi si awon arun. Tele eto ile-iwosan. HPV, measles, polio fipamo aye.\n0. Pada  00. Akoko akojo",
        options: { "0": "yo_main", "00": "yo_main" }
    },

    // IGBO MENUS
    "ig_main": {
        text: "MENU MBU:\n1. Gbochie Aria\n2. Mgbaama Mberede\n3. Ahu Ike Umuaka\n4. Ogwu mgbochi & Akwukwo mgbochi\n0. Puo",
        options: { "1": "ig_prevent", "2": "ig_emergency", "3": "ig_child", "4": "ig_immunize", "0": "exit" }
    },
    "ig_prevent": {
        text: "PREVENT DISEASES:\n1. Malaria\n2. Oria Akpiri/Oria Typhoid\n3. Oria Ogwu/Pneumonia\n4. Lassa Fever\n5. Obara mgbali & Stroke\n6. Atosis\n7. Oria Cancer\n8. Ahu Ike uche\n0. Laghachi  00. Menu Mbu",
        options: { "1": "ig_malaria", "2": "ig_diarrhoea", "3": "ig_cold", "4": "ig_lassa", "5": "ig_bp", "6": "ig_diabetes", "7": "ig_cancer", "8": "ig_mental", "0": "ig_main", "00": "ig_main" }
    },
    "ig_malaria": {
        text: "MALARIA:\n1. Ihe kpatara ya\n2. Mgbaama\n3. Mgbochi\n4. Ogwu\n5. Mgbe i ga-aga ulo ogwu\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Causes: Mbughari site na mosquito nwere oria.\n0. Laghachi", options: { "0": "ig_malaria" } },
            "2": { text: "Symptoms: Oria oku, mgbu isi, chills, ike adighi.\n0. Laghachi", options: { "0": "ig_malaria" } },
            "3": { text: "Prevention: Kpochie n'okpuru mosquito net. Hichapu mmiri kwusiri. Jiri ogwu mgbochi mosquito.\n0. Laghachi", options: { "0": "ig_malaria" } },
            "4": { text: "Treatment: Nnwale tupu ogwu. Jiri ogwu malaria kwadoro.\n0. Laghachi", options: { "0": "ig_malaria" } },
            "5": { text: "Hospital: Oria oku >24hrs? Gaa n'ulo ogwu kacha nso.", sms: "O buru na oria oku di ogologo karia awa 24, gaa n'ulo ogwu kacha nso ozugbo maka nnwale malaria.", options: { "0": "ig_malaria" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_diarrhoea": {
        text: "DIARRHOEA & TYPHOID:\n1. Ihe kpatara ya\n2. Mgbaama\n3. Mgbochi\n4. Ogwu ORS\n5. Mgbe i ga-aga ulo ogwu\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Causes: Mmiri adighi ocha na adighi mma ocha aka.\n0. Laghachi", options: { "0": "ig_diarrhoea" } },
            "2": { text: "Symptoms: Nsogbu iga nke ukwuu, vomiting, oria oku, mgbu afo.\n0. Laghachi", options: { "0": "ig_diarrhoea" } },
            "3": { text: "Prevention: Nu mmiri di ocha. Sacha aka mgbe niile. Nri esi nke oma.\n0. Laghachi", options: { "0": "ig_diarrhoea" } },
            "4": { text: "ORS Treatment: Mee ORS na mmiri di ocha. Nu ugboro ugboro iji gbochie dehydration.\n0. Laghachi", options: { "0": "ig_diarrhoea" } },
            "5": { text: "Hospital: Obara na nsi ma o bu ike adighi? Gaa ulo ogwu ozugbo.", sms: "Obara na nsi ma o bu ike adighi? Gaa ulo ogwu ozugbo.", options: { "0": "ig_diarrhoea" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_cold": {
        text: "COLD & PNEUMONIA:\n1. Ihe kpatara ya\n2. Mgbaama\n3. Mgbochi\n4. Ogwu\n5. Mgbaama Puru Iche\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Causes: Virus ma o bu bacterial infection.\n0. Laghachi", options: { "0": "ig_cold" } },
            "2": { text: "Symptoms: Cough, oria oku, imi na-aputa mmiri, mgbu obi.\n0. Laghachi", options: { "0": "ig_cold" } },
            "3": { text: "Prevention: Sacha aka mgbe niile. Zere ndi oria. Kpuchi onu mgbe i na-ese imi.\n0. Laghachi", options: { "0": "ig_cold" } },
            "4": { text: "Treatment: Ezumike, rie mmiri oku. Gaa klinik ma o buru na o gaghi adi mma.\n0. Laghachi", options: { "0": "ig_cold" } },
            "5": { text: "Danger Signs: Mmega ume ngwa ngwa ma o bu mgbu obi? Nwatakiri na-enwe nsogbu iku ume? Gaa ulo ogwu ozugbo.", sms: "Mmega ume ngwa ngwa ma o bu mgbu obi? Nwatakiri na-enwe nsogbu iku ume? Gaa ulo ogwu ozugbo.", options: { "0": "ig_cold" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_lassa": {
        text: "LASSA FEVER:\n1. Ihe kpatara ya\n2. Mgbaama\n3. Mgbochi\n4. Ogwu\n5. Mgbe i ga-aga ulo ogwu\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Causes: Nri metutara nsi nwa odum ma o bu nsi.\n0. Laghachi", options: { "0": "ig_lassa" } },
            "2": { text: "Symptoms: Oria oku, ike adighi, mgbu isi, obara na-emeputa na ikpe di njo.\n0. Laghachi", options: { "0": "ig_lassa" } },
            "3": { text: "Prevention: Chekwaa nri nke oma. Hichapu ulo. Zere odum.\n0. Laghachi", options: { "0": "ig_lassa" } },
            "4": { text: "Treatment: Nlekota ulo ogwu mbu na-enyere survival. Ejila ogwu onwe gi.\n0. Laghachi", options: { "0": "ig_lassa" } },
            "5": { text: "Hospital: Oria oku + ihe metutara odum? Gaa ulo ogwu ozugbo.", sms: "Oria oku + ihe metutara odum? Gaa ulo ogwu ozugbo.", options: { "0": "ig_lassa" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_bp": {
        text: "OBARA MGBALI & STROKE:\n1. Ihe egwu\n2. Mgbaama\n3. Mgbochi\n4. Ndumodu Ilera\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Risk Factors: Nri nke nwere oke nnu, ibu ibu, iku taba, enweghi mgbati.\n0. Laghachi", options: { "0": "ig_bp" } },
            "2": { text: "Symptoms: Mgbu isi, dizziness, mgbu obi ma o bu enweghi.\n0. Laghachi", options: { "0": "ig_bp" } },
            "3": { text: "Prevention: Lelee BP mgbe niile. Mee mgbati, rie nri oma.\n0. Laghachi", options: { "0": "ig_bp" } },
            "4": { text: "Healthy Tips: Belata nnu, nogide na-arusi oru ike. Lelee BP kwa onwa isii.", sms: "Belata nnu, nogide na-arusi oru ike. Lelee BP kwa onwa isii.", options: { "0": "ig_bp" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_diabetes": {
        text: "ATOSIS (DIABETES):\n1. Ihe kpatara ya\n2. Mgbaama\n3. Mgbochi\n4. Nlekota\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Causes: Ebe ezinulo, ibu ibu, nsogbu insulin.\n0. Laghachi", options: { "0": "ig_diabetes" } },
            "2": { text: "Symptoms: Iku mmiri ugboro ugboro, oria oku, ike adighi.\n0. Laghachi", options: { "0": "ig_diabetes" } },
            "3": { text: "Prevention: Rie nri oma, mee mgbati, debe ibu ahu.\n0. Laghachi", options: { "0": "ig_diabetes" } },
            "4": { text: "Management: Lelee shuga gi mgbe niile. Gaa ulo ogwu mgbe niile.", sms: "Lelee shuga gi mgbe niile. Gaa ulo ogwu mgbe niile.", options: { "0": "ig_diabetes" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_cancer": {
        text: "ORIA CANCER:\n1. Uru\n2. Mgbaama\n3. Mgbochi\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Types: Breast, cervical, prostate cancer.\n0. Laghachi", options: { "0": "ig_cancer" } },
            "2": { text: "Symptoms: Lumps, obara, onwu ibu.\n0. Laghachi", options: { "0": "ig_cancer" } },
            "3": { text: "Prevention: Nlekota na vaccines na-enyere. Igbanwe ngwa ngwa na-azoputa ndu.", sms: "Nlekota na vaccines na-enyere. Igbanwe ngwa ngwa na-azoputa ndu.", options: { "0": "ig_cancer" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_mental": {
        text: "AHU IKE UCHU:\n1. Ihe kpatara ya\n2. Mgbaama\n3. Nkwado\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Causes: Nsogbu, trauma, nsogbu ndu.\n0. Laghachi", options: { "0": "ig_mental" } },
            "2": { text: "Symptoms: Oria oku, nchegbu, enweghi mmasi.\n0. Laghachi", options: { "0": "ig_mental" } },
            "3": { text: "Support: Kparita okwu na onye i tukwasiri obi. Gaa onye na-ahu maka ahu ike. Enyemaka di.", sms: "Kparita okwu na onye i tukwasiri obi. Gaa onye na-ahu maka ahu ike. Enyemaka di.", options: { "0": "ig_mental" } },
            "0": "ig_prevent", "00": "ig_main"
        }
    },
    "ig_emergency": {
        text: "EMERGENCY SIGNS:\nObara na-aputa nke ukwuu, nsogbu iku ume, unconsciousness, convulsions. Gaa ulo ogwu ugbu a.",
        sms: "Obara na-aputa nke ukwuu, nsogbu iku ume, unconsciousness, convulsions. Gaa ulo ogwu ugbu a.",
        options: { "0": "ig_main" }
    },
    "ig_child": {
        text: "AHU IKE UMUAKA:\n1. Ibu nwa na-amuru\n2. Nri\n3. Mgbaama Puru Iche\n0. Laghachi  00. Menu Mbu",
        options: {
            "1": { text: "Breastfeeding: Naanị ya maka ọnwa 6.\n0. Laghachi", options: { "0": "ig_child" } },
            "2": { text: "Nutrition: Bido nri ezinụlọ dị mma mgbe ọnwa 6 gịrị.\n0. Laghachi", options: { "0": "ig_child" } },
            "3": { text: "Danger Signs: Adịghị eri nri, agbọ onụ, ọba ahụ, iku ume ọsọ ọsọ. Gaa ụlọ ọgwụ.\n0. Laghachi", options: { "0": "ig_child" } },
            "0": "ig_main", "00": "ig_main"
        }
    },
    "ig_immunize": {
        text: "IMMUNIZATION & VACCINATION:\nChebe puo n'ahu oria. Soro usoro ulo ogwu. HPV, measles, polio na-echekwa ndu.\n0. Laghachi  00. Menu Mbu",
        options: { "0": "ig_main", "00": "ig_main" }
    },

    // HAUSA MENUS
    "ha_main": {
        text: "MENU NA FARKO:\n1. Hana Cututtuka\n2. Alamun Gaggawa\n3. Lafiyar Yara\n4. Rigakafi & Allurar Rigakafi\n0. Fita",
        options: { "1": "ha_prevent", "2": "ha_emergency", "3": "ha_child", "4": "ha_immunize", "0": "exit" }
    },
    "ha_prevent": {
        text: "PREVENT DISEASES:\n1. Malaria\n2. Zawo/Taifod\n3. Ciwon Mura/Pneumonia\n4. Lassa Fever\n5. Hawan Jini & Stroke\n6. Atosi\n7. Cutar Jejere\n8. Lafiyar Hankali\n0. Komawa  00. Menu na Farko",
        options: { "1": "ha_malaria", "2": "ha_diarrhoea", "3": "ha_cold", "4": "ha_lassa", "5": "ha_bp", "6": "ha_diabetes", "7": "ha_cancer", "8": "ha_mental", "0": "ha_main", "00": "ha_main" }
    },
    "ha_malaria": {
        text: "MALARIA:\n1. Abubuwan da ke haifar da shi\n2. Alamun cuta\n3. Rigakafi\n4. Magani\n5. Lokacin zuwa Asibiti\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Causes: Cizon sauro mai dauke da cuta.\n0. Komawa", options: { "0": "ha_malaria" } },
            "2": { text: "Symptoms: Zazzabi, ciwon kai, sanyi, gajiya.\n0. Komawa", options: { "0": "ha_malaria" } },
            "3": { text: "Prevention: Kwanta a karkashin katifa mai rigakafi. Tsaftace ruwa mai tsayuwa. Yi amfani da maganin sauro.\n0. Komawa", options: { "0": "ha_malaria" } },
            "4": { text: "Treatment: Gwaji kafin magani. Yi amfani da magungunan malaria masu inganci.\n0. Komawa", options: { "0": "ha_malaria" } },
            "5": { text: "Hospital: Zazzabi >24hrs? Je zuwa cibiyar lafiya mafi kusa.", sms: "Idan zazzabi ya wuce awanni 24, je zuwa cibiyar lafiya mafi kusa nan da nan domin gwajin malaria.", options: { "0": "ha_malaria" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_diarrhoea": {
        text: "DIARRHOEA & TYPHOID:\n1. Abubuwan da ke haifar da shi\n2. Alamun cuta\n3. Rigakafi\n4. Maganin ORS\n5. Lokacin zuwa Asibiti\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Causes: Ruwa mai datti da rashin tsafta.\n0. Komawa", options: { "0": "ha_diarrhoea" } },
            "2": { text: "Symptoms: Yawan fitsari, amai, zazzabi, ciwon ciki.\n0. Komawa", options: { "0": "ha_diarrhoea" } },
            "3": { text: "Prevention: Sha ruwa mai tsabta. Wanke hannu akai-akai. Ci abinci da kyau.\n0. Komawa", options: { "0": "ha_diarrhoea" } },
            "4": { text: "ORS Treatment: Hada ORS da ruwa mai tsabta. Sha akai-akai don kauce wa dehydration.\n0. Komawa", options: { "0": "ha_diarrhoea" } },
            "5": { text: "Hospital: Jini a bayan gida ko gajiya? Je zuwa asibiti nan take.", sms: "Jini a bayan gida ko gajiya? Je zuwa asibiti nan take.", options: { "0": "ha_diarrhoea" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_cold": {
        text: "COLD & PNEUMONIA:\n1. Abubuwan da ke haifar da shi\n2. Alamun cuta\n3. Rigakafi\n4. Magani\n5. Alamun Hatsari\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Causes: Cutar virus ko bacteria.\n0. Komawa", options: { "0": "ha_cold" } },
            "2": { text: "Symptoms: Tari, zazzabi, hanci mai ruwa, ciwon kirji.\n0. Komawa", options: { "0": "ha_cold" } },
            "3": { text: "Prevention: Wanke hannu akai-akai. Guji masu rashin lafiya. Rufewa baki lokacin tari.\n0. Komawa", options: { "0": "ha_cold" } },
            "4": { text: "Treatment: Huta, sha ruwa mai dumi. Je asibiti idan ba ya inganta.\n0. Komawa", options: { "0": "ha_cold" } },
            "5": { text: "Danger Signs: Numfashi cikin sauri ko ciwon kirji? Yaro na wahala numfashi? Je zuwa asibiti nan take.", sms: "Numfashi cikin sauri ko ciwon kirji? Yaro na wahala numfashi? Je zuwa asibiti nan take.", options: { "0": "ha_cold" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_lassa": {
        text: "LASSA FEVER:\n1. Abubuwan da ke haifar da shi\n2. Alamun cuta\n3. Rigakafi\n4. Magani\n5. Lokacin zuwa Asibiti\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Causes: Abinci da datti daga fitsari ko najasa beraye.\n0. Komawa", options: { "0": "ha_lassa" } },
            "2": { text: "Symptoms: Zazzabi, gajiya, ciwon kai, jini a cikin manyan lamura.\n0. Komawa", options: { "0": "ha_lassa" } },
            "3": { text: "Prevention: Adana abinci yadda ya kamata. Tsaftace gida. Guji beraye.\n0. Komawa", options: { "0": "ha_lassa" } },
            "4": { text: "Treatment: Neman lafiya a asibiti da wuri yana taimakawa rayuwa. Kada ka yi magani da kanka.\n0. Komawa", options: { "0": "ha_lassa" } },
            "5": { text: "Hospital: Zazzabi + haduwa da beraye? Je asibiti nan take.", sms: "Zazzabi + haduwa da beraye? Je asibiti nan take.", options: { "0": "ha_lassa" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_bp": {
        text: "HAWAN JINI & STROKE:\n1. Abubuwan hadari\n2. Alamun cuta\n3. Rigakafi\n4. Shawarar Lafiya\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Risk Factors: Yawan gishiri, kiba, shan taba, rashin motsa jiki.\n0. Komawa", options: { "0": "ha_bp" } },
            "2": { text: "Symptoms: Ciwon kai, dizziness, ciwon kirji ko babu.\n0. Komawa", options: { "0": "ha_bp" } },
            "3": { text: "Prevention: Duba BP akai-akai. Yi motsa jiki, ci abinci mai kyau.\n0. Komawa", options: { "0": "ha_bp" } },
            "4": { text: "Healthy Tips: Rage gishiri, kasance mai aiki. Duba BP kowane watanni 6.", sms: "Rage gishiri, kasance mai aiki. Duba BP kowane watanni 6.", options: { "0": "ha_bp" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_diabetes": {
        text: "ATOSI (DIABETES):\n1. Abubuwan da ke haifar da shi\n2. Alamun cuta\n3. Rigakafi\n4. Gudanarwa\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Causes: Tarihi iyali, kiba, matsalar insulin.\n0. Komawa", options: { "0": "ha_diabetes" } },
            "2": { text: "Symptoms: Yawan fitsari, jin kishirwa, gajiya.\n0. Komawa", options: { "0": "ha_diabetes" } },
            "3": { text: "Prevention: Ci abinci mai kyau, motsa jiki, kiyaye nauyi.\n0. Komawa", options: { "0": "ha_diabetes" } },
            "4": { text: "Management: Duba sukari a jini akai-akai. Je asibiti.", sms: "Duba sukari a jini akai-akai. Je asibiti.", options: { "0": "ha_diabetes" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_cancer": {
        text: "CUTA JEJERE:\n1. Nau'in\n2. Alamun cuta\n3. Rigakafi\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Types: Jejere oyan, jejere ileomo, jejere ileomo okunrin.\n0. Komawa", options: { "0": "ha_cancer" } },
            "2": { text: "Symptoms: Kumburi, jini, rage nauyi.\n0. Komawa", options: { "0": "ha_cancer" } },
            "3": { text: "Prevention: Gwaje-gwaje da rigakafi suna taimakawa. Gano cuta da wuri yana ceton rai.", sms: "Gwaje-gwaje da rigakafi suna taimakawa. Gano cuta da wuri yana ceton rai.", options: { "0": "ha_cancer" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_mental": {
        text: "LAFIYAR HANKALI:\n1. Abubuwan da ke haifar da shi\n2. Alamun cuta\n3. Taimako\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Causes: Damuwa, trauma, matsalolin rayuwa.\n0. Komawa", options: { "0": "ha_mental" } },
            "2": { text: "Symptoms: Kewa, damuwa, rashin sha'awa.\n0. Komawa", options: { "0": "ha_mental" } },
            "3": { text: "Support: Yi magana da wanda ka yarda da shi. Je ga mai kiwon lafiya. Taimako na nan.", sms: "Yi magana da wanda ka yarda da shi. Je ga mai kiwon lafiya. Taimako na nan.", options: { "0": "ha_mental" } },
            "0": "ha_prevent", "00": "ha_main"
        }
    },
    "ha_emergency": {
        text: "ALAMUN GAGGAWA:\nJini mai yawa, wahalar numfashi, rashin sani, girgiza. Je zuwa asibiti NAN TAKE.",
        sms: "ALAMUN GAGGAWA: Jini mai yawa, wahalar numfashi, rashin sani, girgiza. Je zuwa asibiti NAN TAKE.",
        options: { "0": "ha_main" }
    },
    "ha_child": {
        text: "LAFIYAR YARA:\n1. Shayarwa\n2. Abinci\n3. Alamun Hatsari\n0. Komawa  00. Menu na Farko",
        options: {
            "1": { text: "Breastfeeding: Nono kawai na tsawon watanni 6.\n0. Komawa", options: { "0": "ha_child" } },
            "2": { text: "Nutrition: Fara abincin gida mai kyau bayan watanni 6.\n0. Komawa", options: { "0": "ha_child" } },
            "3": { text: "Danger Signs: Rashin cin abinci, amai, zazzabi, numfashi da sauri. Je asibiti.\n0. Komawa", options: { "0": "ha_child" } },
            "0": "ha_main", "00": "ha_main"
        }
    },
    "ha_immunize": {
        text: "RIGAKAFI & ALLURAR RIGAKAFI:\nKare daga cututtuka. Bi jadawalin asibiti. HPV, measles, polio suna ceton rayuka.\n0. Komawa  00. Menu na Farko",
        options: { "0": "ha_main", "00": "ha_main" }
    }
};

// Expose map data
const nigerianStatesMapData = {
    // We will use logic in app.js to color them
};
