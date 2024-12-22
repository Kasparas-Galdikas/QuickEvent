export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo.png" // Path to your custom logo in the public directory
            alt="Logo"
        />
    );
}
