import React from "react";
import { Col, ConfigProvider, Row, Statistic } from "antd";
import themeConfig from "@/theme/themeConfig";
import Statistics from "@/Components/Dashboard/Statistics";
import ClassLists from "@/Components/Dashboard/ClassLists";
import Container from "@/Components/Global/Container";

export default async function Dashboard() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Container>
        <Row gutter={16}>
          <Col span={16}>
            <div className=" flex flex-col gap-6 min-h-[50vh]">
              <Statistics />
              <div className=" bg-red-100 flex-1">graph</div>
            </div>
          </Col>
          <Col span={8}>
            <ClassLists />
          </Col>
        </Row>
      </Container>
    </ConfigProvider>
  );
}
