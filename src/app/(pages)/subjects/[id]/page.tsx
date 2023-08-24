import Container from "@/Components/Global/Container";
import themeConfig from "@/theme/themeConfig";
import { Button, ConfigProvider, Typography } from "antd";
import React from "react";
const { Title } = Typography;

interface PageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: PageProps) => {
  const { id } = params;

  return (
    <ConfigProvider theme={themeConfig}>
      <Container>
        <div className=" flex flex-col gap-6">
          <div className=" flex justify-between">
            <Button>Back</Button>
            <div className=" flex gap-2">
              <Button> 1 - 1 Price 999 thb</Button>
              <Button type="primary">Group price 999 thb</Button>
            </div>
          </div>
          <div className=" flex gap-4">
            <div className="  bg-red-50 overflow-hidden aspect-square w-96  ">
              <img
                style={{
                  objectFit: "cover",
                  aspectRatio: "1/1",
                  height: "100%",
                  borderRadius: "16px",
                }}
                src={
                  "https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                }
              />
            </div>
            <p>Subject name</p>
          </div>
        </div>
      </Container>
    </ConfigProvider>
  );
};

export default page;
