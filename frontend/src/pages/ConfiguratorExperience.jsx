import CarConfigurator from "./CarConfigurator";
import ConfiguratorAIAssistant from "../components/configurator/ConfiguratorAIAssistant";
import MultiVariantRecommendations from "../components/configurator/MultiVariantRecommendations";

export default function ConfiguratorExperience() {
  return (
    <div className="relative">
      <CarConfigurator />
      <div className="aai-assistants">
        <div className="aai-assistant-item">
          <MultiVariantRecommendations />
        </div>
        <div className="aai-assistant-item">
          <ConfiguratorAIAssistant />
        </div>
      </div>
    </div>
  );
}
