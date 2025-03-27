import { CLIENT_DATA_KEY, IState } from '../state';

interface Props {
    envVars?: Record<string, unknown>;
    state?: IState;
    children: any;
}

export default (props: Props) => {
    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>
                <link rel="stylesheet" href="/public/index.css" />
                <title>InfiniTea</title>
            </head>
            <html lang="en">
                <body>
                    <script dangerouslySetInnerHTML={{
                        __html: `var process={"env": ${JSON.stringify(props.envVars, null, 2)}}`
                    }}></script>
                    <script id={CLIENT_DATA_KEY} type="application/json" dangerouslySetInnerHTML={{
                        __html: JSON.stringify(props.state)
                    }}></script>
                    <script type="text/javascript" dangerouslySetInnerHTML={{
                        __html: `(function(c,l,a,r,i,t,y){
                            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", "${process.env.CLARITY_PROJECT_ID}");`
                    }}></script>
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID}`}></script>
                    <script dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID}');`
                    }}></script>
                    <div id="root">{props.children}</div>
                    <script type="module" src="/public/client.js" async></script>
                </body>
            </html>
        </>
    );
}
