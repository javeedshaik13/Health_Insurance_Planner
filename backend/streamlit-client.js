const puppeteer = require('puppeteer');

class StreamlitClient {
  constructor(streamlitUrl) {
    this.streamlitUrl = streamlitUrl;
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      await this.page.goto(this.streamlitUrl, { waitUntil: 'networkidle0' });
      
      // Wait for Streamlit to load
      await this.page.waitForSelector('div[data-testid="stApp"]', { timeout: 30000 });
      console.log('Streamlit app loaded successfully');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Streamlit client:', error);
      return false;
    }
  }

  async fillFormAndPredict(formData) {
    try {
      if (!this.page) {
        throw new Error('Streamlit client not initialized');
      }

      // Fill Age
      await this.page.evaluate((age) => {
        const ageInput = document.querySelector('input[aria-label="Age"]');
        if (ageInput) {
          ageInput.value = age;
          ageInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, formData['Age'].toString());

      // Fill Number of Dependants
      await this.page.evaluate((dependants) => {
        const dependantsInput = document.querySelector('input[aria-label="Number of Dependants"]');
        if (dependantsInput) {
          dependantsInput.value = dependants;
          dependantsInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, formData['Number of Dependants'].toString());

      // Fill Income in Lakhs
      await this.page.evaluate((income) => {
        const incomeInput = document.querySelector('input[aria-label="Income in Lakhs"]');
        if (incomeInput) {
          incomeInput.value = income;
          incomeInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, formData['Income in Lakhs'].toString());

      // Fill Genetical Risk
      await this.page.evaluate((risk) => {
        const riskInput = document.querySelector('input[aria-label="Genetical Risk"]');
        if (riskInput) {
          riskInput.value = risk;
          riskInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, formData['Genetical Risk'].toString());

      // Handle select boxes
      await this.selectOption('Insurance Plan', formData['Insurance Plan']);
      await this.selectOption('Employment Status', formData['Employment Status']);
      await this.selectOption('Gender', formData['Gender']);
      await this.selectOption('Marital Status', formData['Marital Status']);
      await this.selectOption('BMI Category', formData['BMI Category']);
      await this.selectOption('Smoking Status', formData['Smoking Status']);
      await this.selectOption('Region', formData['Region']);
      await this.selectOption('Medical History', formData['Medical History']);

      // Wait a bit for all inputs to be processed
      await this.page.waitForTimeout(1000);

      // Click the Predict button
      await this.page.evaluate(() => {
        const predictButton = Array.from(document.querySelectorAll('button')).find(
          button => button.textContent.includes('Predict')
        );
        if (predictButton) {
          predictButton.click();
        }
      });

      // Wait for the result
      await this.page.waitForTimeout(3000);

      // Extract the prediction result
      const prediction = await this.page.evaluate(() => {
        // Look for success message with prediction
        const successElements = document.querySelectorAll('[data-testid="stSuccess"]');
        for (let element of successElements) {
          const text = element.textContent;
          if (text.includes('Predicted Health Insurance Cost:')) {
            const match = text.match(/Predicted Health Insurance Cost:\s*(\d+)/);
            if (match) {
              return parseInt(match[1]);
            }
          }
        }
        return null;
      });

      return prediction;

    } catch (error) {
      console.error('Error in fillFormAndPredict:', error);
      throw error;
    }
  }

  async selectOption(labelText, value) {
    try {
      await this.page.evaluate((label, val) => {
        // Find the select box by label
        const labels = Array.from(document.querySelectorAll('label'));
        const targetLabel = labels.find(l => l.textContent.includes(label));
        
        if (targetLabel) {
          // Find the associated select element
          const selectBox = targetLabel.parentElement.querySelector('select') || 
                           targetLabel.nextElementSibling?.querySelector('select');
          
          if (selectBox) {
            // Find and select the option
            const options = Array.from(selectBox.options);
            const targetOption = options.find(option => option.text === val || option.value === val);
            
            if (targetOption) {
              selectBox.value = targetOption.value;
              selectBox.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }
      }, labelText, value);
    } catch (error) {
      console.error(`Error selecting option for ${labelText}:`, error);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

module.exports = StreamlitClient;
