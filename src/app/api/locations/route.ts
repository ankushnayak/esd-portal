import { City, Country, State } from "country-state-city";
import { NextRequest, NextResponse } from "next/server";

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type === "countries") {
    const countries = Country.getAllCountries()
      .map((country) => ({
        isoCode: country.isoCode,
        name: country.name,
        phoneCode: `+${country.phonecode}`,
      }))
      .sort((left, right) => left.name.localeCompare(right.name));

    return NextResponse.json({ options: countries });
  }

  if (type === "states") {
    const countryIso = searchParams.get("country");

    if (!countryIso) {
      return NextResponse.json({ message: "Country code is required." }, { status: 400 });
    }

    const states = State.getStatesOfCountry(countryIso)
      .map((state) => ({
        isoCode: state.isoCode,
        name: state.name,
      }))
      .sort((left, right) => left.name.localeCompare(right.name));

    return NextResponse.json({ options: states });
  }

  if (type === "cities") {
    const countryIso = searchParams.get("country");
    const stateIso = searchParams.get("state");

    if (!countryIso || !stateIso) {
      return NextResponse.json({ message: "Country and state codes are required." }, { status: 400 });
    }

    const cities = uniqueSorted(City.getCitiesOfState(countryIso, stateIso).map((city) => city.name));
    return NextResponse.json({ options: cities });
  }

  return NextResponse.json({ message: "Unsupported location query." }, { status: 400 });
}
