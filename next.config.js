/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "kgjimzdelnpigevgscbx.supabase.co",
            "wnxfzynxyvzahqireows.supabase.co",
        ],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        })

        return config
    },
    // async redirects() {
    //     return [
    //         {
    //             source: "/",
    //             destination: "/client",
    //             permanent: true, // creates a 308 permanent redirect
    //         },
    //         {
    //             source: "/client/projects",
    //             destination: "/client/projects/my-project",
    //             permanent: true, // creates a 308 permanent redirect
    //         },
    //     ]
    // },
}

module.exports = nextConfig
