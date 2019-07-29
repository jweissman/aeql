const capitalize: (s: string) => string = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1)

const downcase: (s: string) => string = (s: string) => s.toLowerCase();

export default {
    capitalize,
    downcase,
}