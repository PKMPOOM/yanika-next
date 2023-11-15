"use client";

import { gradesOption } from "@/constant/Grades";
import { subjectFullTypes } from "@/interface/interface";
import { editSubjectSchema } from "@/interface/payload_validator";
import {
  ExclamationCircleFilled,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { BlockNoteEditor } from "@blocknote/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
  Upload,
  UploadProps,
  theme,
} from "antd";
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import WideBTNSpan from "../Global/WideBTNSpan";
import { SubjectPageContext } from "./AllSubjects";
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  Theme,
  lightDefaultTheme,
  useBlockNote,
} from "@blocknote/react";
import { useSession } from "next-auth/react";

const { Text } = Typography;

const { useToken } = theme;

const FormItemStyle = {
  marginBottom: 8,
};

const { Dragger } = Upload;

const selectMenu = [
  { value: "Onet", label: "Onet" },
  { value: "Gat Pat", label: "Gat Pat" },
  { value: "Science", label: "Science" },
  { value: "math", label: "math" },
  { value: "English", label: "English" },
  { value: "Thai", label: "Thai" },
];

const blockTheme = {
  ...lightDefaultTheme,
  componentStyles: (theme) => ({
    // Adds basic styling to the editor.
    Editor: {
      backgroundColor: theme.colors.editor.background,
      borderRadius: theme.borderRadius,
      border: `1px solid ${theme.colors.border}`,
      // boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    },
    // Makes all hovered dropdown & menu items blue.
    Menu: {
      ".mantine-Menu-item[data-hovered], .mantine-Menu-item:hover": {
        backgroundColor: "#34d399",
      },
    },
    Toolbar: {
      ".mantine-Menu-dropdown": {
        ".mantine-Menu-item:hover": {
          backgroundColor: "blue",
        },
      },
    },
  }),
} satisfies Theme;

function EditSubjectModal({
  activeSubject,
}: {
  activeSubject: string | undefined;
}) {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { EditSubjectModalOpen, setEditSubjectModalOpen, setActiveSubject } =
    useContext(SubjectPageContext);
  const [Error, setError] = useState<string | null>(null);
  const [Uploading, setUploading] = useState(false);
  const [Url, setUrl] = useState<string | undefined>("");
  const [Loading, setLoading] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);
  const { token } = useToken();
  const queryClient = useQueryClient();

  const isAdmin = session?.user.role === "admin";

  const fetchSubjectData = async () => {
    const res = await axios.get(`/api/subject/${activeSubject}`);
    return res.data.subject;
  };

  const { data: SubjectsData } = useQuery<subjectFullTypes>({
    queryKey: ["Subject", activeSubject],
    queryFn: fetchSubjectData,
    refetchOnWindowFocus: false,
    enabled: activeSubject !== undefined,
  });

  // const localStorageKey = `editorContent${activeSubject}`;
  // const initialContent: string | null = localStorage.getItem(localStorageKey);
  const editor: BlockNoteEditor = useBlockNote({
    // initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    editable: isAdmin,
    onEditorContentChange: (editor) => {
      localStorage.setItem(
        `editorContent`,
        JSON.stringify(editor.topLevelBlocks),
      );
    },
  });

  useEffect(() => {
    if (SubjectsData && IsEditing === false) {
      setIsEditing(true);
      form.setFieldsValue({
        subject_name: SubjectsData.name,
        tags: SubjectsData.tags,
        description: SubjectsData.description,
        grade: SubjectsData.grade,
        course_outline: SubjectsData.course_outline,
        single_price: SubjectsData.single_price,
        group_price: SubjectsData.group_price,
      });
      if (SubjectsData.image_url) {
        setUrl(SubjectsData.image_url);
      }
      editor.insertBlocks(
        JSON.parse(SubjectsData.course_outline),
        editor.getTextCursorPosition().block,
        "before",
      );
    }
  }, [SubjectsData]);

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    showUploadList: false,
    beforeUpload(file) {
      if (!file.type.includes("image/")) {
        setError("Please upload image file");
        console.log("error");

        return false;
      }

      // Check file size
      const fileSize = file.size / 1024 / 1024; // in MB
      if (fileSize > 2) {
        setError("Maximum file size is 2 MB");
        console.log("error");
        return false;
      }

      // Save file to state
      return true;
    },

    action: `/api/subject/${activeSubject}/upload`,
    onChange(info) {
      console.log(info);

      setUploading(true);
      if (info.file.status === "uploading") {
        console.log("uploading");
      }
      if (info.file.status === "done") {
        console.log(info);
        setUploading(false);
        console.log(info.file.response.Url);

        setUrl(info.file.response.Url);
      } else if (info.file.status === "error") {
        console.log(info.file.response.error);
        setUploading(false);
        setError(info.file.response.error.error);
        console.log(Error);
      }
    },
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onCancel = async () => {
    form.resetFields();
    setActiveSubject(undefined);
    setEditSubjectModalOpen(false);
    setIsEditing(false);
    setUrl(undefined);
    editor.removeBlocks(editor.topLevelBlocks);
    queryClient.invalidateQueries(["Subject", activeSubject]);
  };

  const editSubjectDetail = async (
    event: z.infer<typeof editSubjectSchema>,
  ) => {
    const payload = {
      ...event,
      blockNoteData: JSON.stringify(editor.topLevelBlocks),
    };

    setLoading(true);
    try {
      await axios.put(`/api/subject/${activeSubject}`, {
        ...payload,
      });
      onCancel();
      setIsEditing(false);
      queryClient.invalidateQueries(["SubjectList"]);
      queryClient.invalidateQueries(["Subject", activeSubject]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Modal
      open={EditSubjectModalOpen}
      onCancel={onCancel}
      width={"1000px"}
      footer={null}
      title="Edit subject"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={editSubjectDetail}
        requiredMark={"optional"}
        initialValues={{
          subject_name: "",
          tags: [],
          description: "",
          grade: "",
          course_outline: "",
          single_price: 100,
          group_price: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Subject name cannot be empty",
                },
              ]}
              name={"subject_name"}
              style={FormItemStyle}
              label="Subject Name"
            >
              <Input placeholder="Subject Name" />
            </Form.Item>

            <Form.Item name={"tags"} style={FormItemStyle} label="Tags">
              <Select options={selectMenu} mode="tags" />
            </Form.Item>

            <Form.Item
              name={"description"}
              style={FormItemStyle}
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Description name cannot be empty",
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 5, maxRows: 10 }}
                placeholder="Description"
              />
            </Form.Item>

            <Form.Item label="Image">
              <Form.Item
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Dragger {...props} disabled={Uploading}>
                  <div className="  flex h-24 flex-col items-center justify-center gap-1 ">
                    {Uploading ? (
                      <div className=" absolute inset-0 z-10 flex items-center justify-center bg-white/40">
                        <LoadingOutlined
                          style={{ color: token.colorPrimary, fontSize: 50 }}
                        />
                      </div>
                    ) : null}

                    {Url ? (
                      <Image
                        style={{
                          position: "absolute",
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                        alt="subject image"
                        src={Url}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <>
                        {Error ? (
                          <ExclamationCircleFilled
                            style={{
                              color: token.colorErrorText,
                              fontSize: 24,
                            }}
                          />
                        ) : (
                          <UploadOutlined
                            style={{
                              color: token.colorPrimary,
                              fontSize: 24,
                            }}
                          />
                        )}

                        {Error ? (
                          <>
                            <p style={{ color: token.colorErrorText }}>
                              {Error}
                            </p>
                            <p style={{ color: token.colorErrorText }}>
                              try upload different file
                            </p>
                          </>
                        ) : (
                          <p>Add Subject image</p>
                        )}
                      </>
                    )}
                  </div>
                </Dragger>
              </Form.Item>
            </Form.Item>

            <Form.Item style={FormItemStyle}>
              <div className="flex w-full items-center justify-between ">
                <Text>1-1 price</Text>
                <div className=" flex items-center gap-2">
                  <Form.Item
                    name="single_price"
                    rules={[
                      {
                        required: true,
                        message: "price cannot be empty",
                      },
                    ]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="price "
                      style={{
                        margin: "0 8px",
                      }}
                      min={1}
                      max={9999}
                    />
                  </Form.Item>
                  <Text>THB</Text>
                </div>
              </div>
            </Form.Item>

            <Form.Item>
              <div className="  flex  w-full items-center justify-between ">
                <Text>Price per student</Text>
                <div className=" flex items-center gap-2">
                  <Form.Item
                    name="group_price"
                    rules={[
                      {
                        required: true,
                        message: "price cannot be empty",
                      },
                    ]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="price "
                      style={{
                        margin: "0 8px",
                      }}
                      min={0}
                      max={9999}
                    />
                  </Form.Item>
                  <Text>THB</Text>
                </div>
              </div>
              <Text type="secondary">Input 0 if group class not available</Text>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name={"grade"}
              style={FormItemStyle}
              label="Grade"
              rules={[
                {
                  required: true,
                  message: "Please select grade for this subject",
                },
              ]}
            >
              <Select showSearch options={gradesOption} />
            </Form.Item>
            Course outline
            <div className=" max-h-[600px] overflow-auto">
              <BlockNoteView
                editor={editor}
                theme={blockTheme}
                onChange={() => {
                  console.log(editor);
                }}
              />
            </div>
          </Col>
        </Row>
        <div className=" flex w-full justify-end gap-2">
          <Button htmlType="reset" onClick={onCancel} type="text">
            Cancel
          </Button>
          <Button loading={Loading} htmlType="submit" type="primary">
            <WideBTNSpan>Save</WideBTNSpan>
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default EditSubjectModal;
