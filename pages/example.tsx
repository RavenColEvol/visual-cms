import { useEffect, useState } from "react";
import { BuilderComponent } from "../packages/react";
import weeb from "../packages/sdk";

// CLIENT SIDE CODE
function ReactExample() {
  const [suidata, setSUIData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const suidata = await weeb.fetch('ct_uid', {
        page_url: '/'
      });
      setSUIData(suidata);
    })();
  }, [])
  return (
    suidata ? <BuilderComponent suidata={suidata}/> : <>Loading...</>
  );
}
export default ReactExample;
