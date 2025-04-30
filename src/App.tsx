import { Provider } from "@/components/ui/provider";
import { ContentLayout } from "./components/layout/ContentLayout";
import { GameManager } from "./components/GameManager";

export const App = () => {
    return <Provider>
        <ContentLayout>
            <GameManager />
        </ContentLayout>
    </Provider>
}