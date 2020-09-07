import React from "react";
import { getSquads } from "../data";
import Card from "./Shared/Card";
import MuiVirtualizedTable from "./Squads/MuiVirtualizedTable";

const Suqads = () => {
  const data = getSquads();

  return (
      <>
        {data.map((element, idx) => (
          <Card title={element[0].squad.title} secondary={`Squad Count: ${element.length}`} >
            <MuiVirtualizedTable data={element} />
          </Card>
        ))}
      </>
  );
};

export default Suqads;
