# Privacy Attack Explorer

A hands-on educational tool to explore and understand privacy vulnerabilities in machine learning models through interactive simulations of membership inference attacks and differential privacy.

## Project Overview

This project demonstrates:
1. **Basic membership inference attacks** - How models can inadvertently reveal if specific data was used during training
2. **Advanced attacks with shadow models** - Using auxiliary data to improve attack accuracy
3. **Differential privacy protection** - Applying noise to model outputs to protect against privacy leaks

The application guides users through three progressive stages, allowing experimentation with different attack parameters and privacy settings to understand the fundamental trade-off between privacy and utility in machine learning.

## Data Generation

This project uses synthetic patient health data to simulate privacy attacks:

- Data is pre-calculated using a Python script that generates realistic patient records with features like age, blood pressure, and medical conditions
- The script trains machine learning models on subsets of the data and calculates confidence scores
- For differential privacy experiments, varying levels of noise are applied based on different epsilon values

To regenerate the synthetic data:

```bash
# Install Python dependencies first
pip install -r src/data/requirements.txt

# Then generate the data
npm run generate-data
```

The data generation process creates three JSON files in `src/data/generated/` that power the interactive visualizations.

## Project Structure

```
privacy-attack-explorer/
├── src/
│   ├── components/        # UI components
│   │   ├── stages/        # Main stage components for the three attack scenarios
│   │   └── ui/            # Reusable UI components using shadcn/ui
│   ├── data/              # Data generation
│   │   ├── generate_synthetic_data.py  # Python script for data generation
│   │   └── generated/     # Generated JSON files
│   ├── hooks/             # React hooks
│   └── types/             # TypeScript type definitions
└── public/                # Public assets
```

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd privacy-attack-explorer
npm install
```

2. Generate the synthetic data (requires Python 3.7+ with required packages):

```bash
npm run generate-data
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173/)

## Technologies

- React 18
- TypeScript
- Vite
- shadcn/ui components
- Tailwind CSS
- Recharts for data visualization
- Python (NumPy, Pandas, scikit-learn) for data generation
