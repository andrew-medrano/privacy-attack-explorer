
{calculateAccuracy() && (
  <Card className="p-4 mt-4">
    <h4 className="font-semibold mb-2">Attack Results</h4>
    <p className="text-sm">
      Attack Accuracy: {calculateAccuracy()?.accuracy.toFixed(1)}%
      <br />
      Baseline Accuracy: {calculateAccuracy()?.baselineAccuracy}% 
      (random guessing based on training set proportion)
      <br />
      True Positives: {calculateAccuracy()?.truePositives}
      <br />
      Total Predictions: {calculateAccuracy()?.totalPredictions}
      <br />
      Result: {calculateAccuracy()?.accuracyDescription}
    </p>
    <p className="text-sm text-muted-foreground mt-4">
      {epsilon[0] > 0.7 
        ? "The model's privacy protection is weak with high epsilon, making the predictions more distinguishable and potentially leaking more information about membership."
        : "Differential privacy provides protection by adding calibrated noise, reducing the model's ability to reveal membership information while maintaining some predictive power."}
    </p>
  </Card>
)}
