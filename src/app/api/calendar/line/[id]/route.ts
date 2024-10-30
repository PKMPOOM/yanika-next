import axios from "axios";
import { ZodError } from "zod";

// edit subject information
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const LineUserID = params.id;

    const url = "https://api.line.me/v2/bot/message/push";
    const token = process.env.LINE_MESSAGE_API_TOKEN;

    const { subjectName, day, startTime, reason } = await req.json();
    const isAccepted = reason === "accepted" ? true : false;
    const ErrorBGUrl =
      "https://kgjimzdelnpigevgscbx.supabase.co/storage/v1/object/public/Public/MeenitesBackgroundError.png";
    const SuccessBGUrl =
      "https://kgjimzdelnpigevgscbx.supabase.co/storage/v1/object/public/Public/MeenitesBackground.png";

    const flexMessage = [
      {
        type: "flex",
        altText: isAccepted ? "Class Accepted" : "Class Rejected",
        contents: {
          type: "bubble",
          hero: {
            type: "image",
            url: isAccepted ? SuccessBGUrl : ErrorBGUrl,
            size: "full",
            aspectRatio: "20:5",
            aspectMode: "cover",
            flex: 1,
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: isAccepted ? "Class Is Accepted" : "Class Is Rejected",
                weight: "bold",
                size: "xl",
              },

              {
                type: "box",
                layout: "vertical",
                margin: "lg",
                spacing: "sm",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      {
                        type: "text",
                        text: "Subject",
                        color: "#aaaaaa",
                        size: "sm",
                        flex: 2,
                      },
                      {
                        type: "text",
                        text: subjectName,
                        wrap: true,
                        color: "#666666",
                        size: "sm",
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      {
                        type: "text",
                        text: "Day",
                        color: "#aaaaaa",
                        size: "sm",
                        flex: 2,
                      },
                      {
                        type: "text",
                        text: day,
                        wrap: true,
                        color: "#666666",
                        size: "sm",
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      {
                        type: "text",
                        text: "Time",
                        color: "#aaaaaa",
                        size: "sm",
                        flex: 2,
                      },
                      {
                        type: "text",
                        text: startTime,
                        wrap: true,
                        color: "#666666",
                        size: "sm",
                        flex: 5,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          footer: {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            contents: [
              {
                type: "button",
                style: "link",
                height: "sm",
                action: {
                  type: "uri",
                  label: "All Subjects",
                  uri: "https://liff.line.me/2001496962-yZvWmBlE",
                },
              },
              {
                type: "button",
                style: "link",
                height: "sm",
                action: {
                  type: "uri",
                  label: "My subjects",
                  uri: "https://liff.line.me/2001496962-9m8NLX56",
                },
              },
            ],
            flex: 0,
          },
        },
      },
    ];

    const postData = {
      to: LineUserID,
      messages: flexMessage,
    };

    await axios
      .post(url, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
