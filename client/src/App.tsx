import { useEffect, useState } from "react";

import { getJson, getText, getXml } from "./shared/api/client/fetchers";
import { HttpStatus } from "./shared/api/client/OpenApiAxios/types";

function App() {
  const [text, setText] = useState("");
  const [json, setJson] = useState("");
  const [xml, setXml] = useState("");

  useEffect(() => {
    const getData = async () => {
      const textData = await getText();
      const jsonData = await getJson();
      const xmlData = await getXml();

      console.log("textData", textData);
      console.log("jsonData", jsonData);
      console.log("xmlData", xmlData);

      if (textData.status === HttpStatus.OK) setText(textData.data);
      else if (textData.status === HttpStatus.BAD_REQUEST) {
        setText("Альтернативный вывод");
      } else setText(textData.error.message);

      if (jsonData.status === HttpStatus.OK) setJson(jsonData.data.data);
      else if (textData.status === HttpStatus.BAD_REQUEST) {
        setJson("Альтернативный вывод");
      } else setJson(textData.error.message);

      if (xmlData.status === HttpStatus.OK) setXml(xmlData.data);
      else if (textData.status === HttpStatus.BAD_REQUEST) {
        setXml("Альтернативный вывод");
      } else setXml(textData.error.message);
    };

    getData();
  }, []);

  return (
    <>
      <div>text: {text}</div>
      <div>json: {json}</div>
      <div>xml: {xml}</div>
    </>
  );
}

export default App;
