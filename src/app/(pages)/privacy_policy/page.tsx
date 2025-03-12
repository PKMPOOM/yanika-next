"use client"

import { Button, Card, Typography } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import Link from "next/link"
import React from "react"

const { Title, Text, Paragraph } = Typography

type Props = {}

const page = (props: Props) => {
    return (
        <div className="overflow-y-auto h-screen">
            <div className="container max-w-4xl py-12 mx-auto ">
                <div className="mb-8">
                    <Link href="/">
                        <Button type="text" size="small" className="mb-4">
                            <ArrowLeftOutlined className="mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <Title level={1} className="tracking-tight">
                        Privacy Policy
                    </Title>
                    <Text type="secondary" className="mt-4 block">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </Text>
                </div>

                <div className="flex flex-col gap-4">
                    <Card title="Introduction">
                        <Paragraph className="text-sm leading-relaxed">
                            This Privacy Policy describes how your personal
                            information is collected, used, and shared when you
                            visit or make a purchase from our website. We
                            respect your privacy and are committed to protecting
                            your personal data.
                        </Paragraph>
                    </Card>

                    <Card title="Information We Collect">
                        <div className="text-sm leading-relaxed space-y-4">
                            <Paragraph>
                                When you visit our site, we automatically
                                collect certain information about your device,
                                including information about your web browser, IP
                                address, time zone, and some of the cookies that
                                are installed on your device.
                            </Paragraph>
                            <Paragraph>
                                Additionally, as you browse the site, we collect
                                information about the individual web pages or
                                products that you view, what websites or search
                                terms referred you to the site, and information
                                about how you interact with the site.
                            </Paragraph>
                            <Paragraph>
                                We also collect personal information you provide
                                to us, such as your name, billing address,
                                shipping address, email address, phone number,
                                credit card information, and other details.
                            </Paragraph>
                        </div>
                    </Card>

                    <Card title="How We Use Your Information">
                        <div className="text-sm leading-relaxed space-y-4">
                            <Paragraph>
                                We use the information we collect to:
                            </Paragraph>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Process orders and to provide customer
                                    service
                                </li>
                                <li>
                                    Communicate with you, including sending
                                    updates about your order
                                </li>
                                <li>
                                    Screen our orders for potential risk or
                                    fraud
                                </li>
                                <li>Improve and optimize our site</li>
                                <li>
                                    Deliver targeted advertising, marketing, or
                                    promotional materials
                                </li>
                            </ul>
                        </div>
                    </Card>

                    <Card title="Sharing Your Information">
                        <Paragraph className="text-sm leading-relaxed">
                            We share your Personal Information with third
                            parties to help us use your Personal Information, as
                            described above. We also use Google Analytics to
                            help us understand how our customers use the site.
                            We may also share your Personal Information to
                            comply with applicable laws and regulations, to
                            respond to a subpoena, search warrant or other
                            lawful request for information we receive, or to
                            otherwise protect our rights.
                        </Paragraph>
                    </Card>

                    <Card title="Cookies">
                        <Paragraph className="text-sm leading-relaxed">
                            We use cookies to help us remember and process the
                            items in your shopping cart, understand and save
                            your preferences for future visits, keep track of
                            advertisements, and compile aggregate data about
                            site traffic and site interaction. You can choose to
                            have your computer warn you each time a cookie is
                            being sent, or you can choose to turn off all
                            cookies through your browser settings.
                        </Paragraph>
                    </Card>

                    <Card title="Data Security">
                        <Paragraph className="text-sm leading-relaxed">
                            We have implemented measures designed to secure your
                            personal information from accidental loss and from
                            unauthorized access, use, alteration, and
                            disclosure. All information you provide to us is
                            stored on secure servers behind firewalls. Any
                            payment transactions will be encrypted using SSL
                            technology.
                        </Paragraph>
                    </Card>

                    <Card title="Your Rights">
                        <div className="text-sm leading-relaxed space-y-4">
                            <Paragraph>
                                If you are a European resident, you have the
                                right to access personal information we hold
                                about you and to ask that your personal
                                information be corrected, updated, or deleted.
                                If you would like to exercise this right, please
                                contact us.
                            </Paragraph>
                            <Paragraph>
                                Additionally, if you are a European resident, we
                                note that we are processing your information in
                                order to fulfill contracts we might have with
                                you, or otherwise to pursue our legitimate
                                business interests listed above. Please note
                                that your information will be transferred
                                outside of Europe, including to Canada and the
                                United States.
                            </Paragraph>
                        </div>
                    </Card>

                    <Card title="Changes to This Privacy Policy">
                        <Paragraph className="text-sm leading-relaxed">
                            We may update this privacy policy from time to time
                            in order to reflect, for example, changes to our
                            practices or for other operational, legal or
                            regulatory reasons. We will post the updated policy
                            on our website with a new effective date.
                        </Paragraph>
                    </Card>

                    {/* <Card title="Contact Us">
                        <div className="text-sm leading-relaxed">
                            <Paragraph>
                                For more information about our privacy
                                practices, if you have questions, or if you
                                would like to make a complaint, please contact
                                us by e-mail at{" "}
                                <Text strong>privacy@yourcompany.com</Text> or
                                by mail using the details provided below:
                            </Paragraph>
                            <div className="mt-4">
                                <Text strong>Your Company Name</Text>
                                <Paragraph>123 Street Address</Paragraph>
                                <Paragraph>City, State ZIP</Paragraph>
                                <Paragraph>Country</Paragraph>
                            </div>
                        </div>
                    </Card> */}
                </div>
            </div>
        </div>
    )
}

export default page
