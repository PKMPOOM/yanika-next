"use client"

import React from "react"
import { Button, Card, List, Space, Typography } from "antd"
import Link from "next/link"
import { LeftOutlined } from "@ant-design/icons"

type Props = {}

const page = (props: Props) => {
    return (
        <div className=" h-screen overflow-y-auto">
            <div className="container max-w-4xl py-12 mx-auto ">
                <div className="mb-8">
                    <Button ghost size="small" className="mb-4">
                        <Link href="/">
                            <LeftOutlined className="mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                    <Typography.Title level={1} className="tracking-tight">
                        Terms of Service
                    </Typography.Title>
                    <Typography.Text type="secondary" className="mt-4 block">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </Typography.Text>
                </div>

                <div className="space-y-8 flex flex-col gap-4">
                    <Card>
                        <Card.Meta
                            title="Acceptance of Terms"
                            description={
                                <Typography.Text className="text-sm leading-relaxed">
                                    By accessing or using our website, you agree
                                    to be bound by these Terms of Service and
                                    all applicable laws and regulations. If you
                                    do not agree with any of these terms, you
                                    are prohibited from using or accessing this
                                    site.
                                </Typography.Text>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="User Accounts"
                            description={
                                <Space
                                    direction="vertical"
                                    className="text-sm leading-relaxed"
                                >
                                    <Typography.Text>
                                        When you create an account with us, you
                                        must provide information that is
                                        accurate, complete, and current at all
                                        times. Failure to do so constitutes a
                                        breach of the Terms, which may result in
                                        immediate termination of your account on
                                        our service.
                                    </Typography.Text>
                                    <Typography.Text>
                                        You are responsible for safeguarding the
                                        password that you use to access the
                                        service and for any activities or
                                        actions under your password. You agree
                                        not to disclose your password to any
                                        third party. You must notify us
                                        immediately upon becoming aware of any
                                        breach of security or unauthorized use
                                        of your account.
                                    </Typography.Text>
                                </Space>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="Intellectual Property"
                            description={
                                <Space
                                    direction="vertical"
                                    className="text-sm leading-relaxed"
                                >
                                    <Typography.Text>
                                        The Service and its original content,
                                        features, and functionality are and will
                                        remain the exclusive property of our
                                        company and its licensors. The Service
                                        is protected by copyright, trademark,
                                        and other laws of both the United States
                                        and foreign countries. Our trademarks
                                        and trade dress may not be used in
                                        connection with any product or service
                                        without the prior written consent of our
                                        company.
                                    </Typography.Text>
                                    <Typography.Text>
                                        User-generated content remains the
                                        intellectual property of the user, but
                                        by uploading such content to our site,
                                        you grant us a non-exclusive,
                                        royalty-free, transferable,
                                        sub-licensable, worldwide license to
                                        use, store, display, reproduce, modify,
                                        create derivative works, perform, and
                                        distribute your content on our Service.
                                    </Typography.Text>
                                </Space>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="User Conduct"
                            description={
                                <Typography.Text className="text-sm leading-relaxed">
                                    Our Service is provided for your personal,
                                    non-commercial use only. You agree not to
                                    reproduce, duplicate, copy, sell, resell or
                                    exploit any portion of the Service, use of
                                    the Service, or access to the Service
                                    without express written permission by us.
                                </Typography.Text>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="Prohibited Activities"
                            description={
                                <>
                                    <Typography.Text className="text-sm leading-relaxed block mb-4">
                                        You may not access or use the Service
                                        for any purpose other than that for
                                        which we make the Service available. The
                                        Service may not be used in connection
                                        with any commercial endeavors except
                                        those that are specifically endorsed or
                                        approved by us.
                                    </Typography.Text>
                                    <List
                                        className="pl-6"
                                        size="small"
                                        split={false}
                                        dataSource={[
                                            "Systematic retrieval of data to create a collection or database",
                                            "Making any unauthorized use of the Service, including collecting usernames and/or email addresses",
                                            "Engaging in any automated use of the system",
                                            "Using the Service for any revenue-generating endeavor or commercial enterprise",
                                            "Attempting to impersonate another user or person",
                                            "Uploading or transmitting viruses, Trojan horses, or other material designed to interrupt, destroy, or limit the functionality of the Service",
                                        ]}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <Typography.Text>
                                                    {item}
                                                </Typography.Text>
                                            </List.Item>
                                        )}
                                    />
                                </>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="Termination"
                            description={
                                <Typography.Text className="text-sm leading-relaxed">
                                    We may terminate or suspend your account
                                    immediately, without prior notice or
                                    liability, for any reason whatsoever,
                                    including without limitation if you breach
                                    the Terms. Upon termination, your right to
                                    use the Service will immediately cease. If
                                    you wish to terminate your account, you may
                                    simply discontinue using the Service.
                                </Typography.Text>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="Limitation of Liability"
                            description={
                                <Typography.Text className="text-sm leading-relaxed">
                                    In no event shall our company, nor its
                                    directors, employees, partners, agents,
                                    suppliers, or affiliates, be liable for any
                                    indirect, incidental, special, consequential
                                    or punitive damages, including without
                                    limitation, loss of profits, data, use,
                                    goodwill, or other intangible losses,
                                    resulting from your access to or use of or
                                    inability to access or use the Service.
                                </Typography.Text>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="Disclaimer of Warranties"
                            description={
                                <Space
                                    direction="vertical"
                                    className="text-sm leading-relaxed"
                                >
                                    <Typography.Text>
                                        Your use of the Service is at your sole
                                        risk. The Service is provided on an "AS
                                        IS" and "AS AVAILABLE" basis. The
                                        Service is provided without warranties
                                        of any kind, whether express or implied,
                                        including, but not limited to, implied
                                        warranties of merchantability, fitness
                                        for a particular purpose,
                                        non-infringement or course of
                                        performance.
                                    </Typography.Text>
                                    <Typography.Text>
                                        Our company, its subsidiaries,
                                        affiliates, and its licensors do not
                                        warrant that a) the Service will
                                        function uninterrupted, secure or
                                        available at any particular time or
                                        location; b) any errors or defects will
                                        be corrected; c) the Service is free of
                                        viruses or other harmful components; or
                                        d) the results of using the Service will
                                        meet your requirements.
                                    </Typography.Text>
                                </Space>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="Governing Law"
                            description={
                                <Typography.Text className="text-sm leading-relaxed">
                                    These Terms shall be governed and construed
                                    in accordance with the laws of the United
                                    States, without regard to its conflict of
                                    law provisions. Our failure to enforce any
                                    right or provision of these Terms will not
                                    be considered a waiver of those rights.
                                </Typography.Text>
                            }
                        />
                    </Card>

                    <Card>
                        <Card.Meta
                            title="Changes to Terms"
                            description={
                                <Typography.Text className="text-sm leading-relaxed">
                                    We reserve the right, at our sole
                                    discretion, to modify or replace these Terms
                                    at any time. If a revision is material we
                                    will try to provide at least 30 days' notice
                                    prior to any new terms taking effect. What
                                    constitutes a material change will be
                                    determined at our sole discretion. By
                                    continuing to access or use our Service
                                    after those revisions become effective, you
                                    agree to be bound by the revised terms.
                                </Typography.Text>
                            }
                        />
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default page
