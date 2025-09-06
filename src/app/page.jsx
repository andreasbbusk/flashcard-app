import Link from "next/link";
import { getSets, getFlashcards } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Settings, BookOpen, BarChart3 } from "lucide-react";
import { AnimatedSection } from "@/components/client-wrapper";

export default async function HomePage() {
  let sets = [];
  let cards = [];
  let error = null;

  try {
    sets = await getSets();
    cards = await getFlashcards();
  } catch (err) {
    error = "Kunne ikke hente sets";
    console.error("Error fetching sets:", err);
  }

  const quickActions = [
    {
      title: "Opret nyt set",
      description: "Start med et nyt flashcard set",
      icon: PlusCircle,
      href: "/sets/new",
      variant: "default",
    },
    {
      title: "Administrer kort",
      description: "Se og rediger alle dine flashcards",
      icon: Settings,
      href: "/cards",
      variant: "outline",
    },
    {
      title: "Administrer sets",
      description: "Organiser dine flashcard sæt",
      icon: BookOpen,
      href: "/sets",
      variant: "outline",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <AnimatedSection className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Flashcard Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Administrer og studer dine flashcards effektivt
          </p>
        </AnimatedSection>

        {/* Quick Stats */}
        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Samlede Sets
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sets.length}</div>
                <p className="text-xs text-muted-foreground">
                  Aktive flashcard sæt
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Samlede Kort
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cards.length}</div>
                <p className="text-xs text-muted-foreground">
                  Flashcards i alt
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Seneste Aktivitet
                </CardTitle>
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">I dag</div>
                <p className="text-xs text-muted-foreground">
                  Sidste opdatering
                </p>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection delay={0.4}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Hurtige Handlinger
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <action.icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">
                          {action.title}
                        </CardTitle>
                      </div>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Recent Sets */}
        <AnimatedSection delay={0.6}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Dine Sets</h2>
              <Link href="/sets">
                <Button variant="outline">Se alle sets</Button>
              </Link>
            </div>

            {error ? (
              <Card>
                <CardContent className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-destructive font-medium mb-2">
                      {error}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Prøv at genindlæse siden
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : sets.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        Ingen sets fundet
                      </h3>
                      <p className="text-muted-foreground">
                        Start med at oprette dit første flashcard set
                      </p>
                    </div>
                    <Link href="/sets/new">
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Opret dit første set
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sets.slice(0, 6).map((set, index) => (
                  <div key={set.id}>
                    <Link href={`/study/${encodeURIComponent(set.name)}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                              {set.name}
                            </CardTitle>
                            <Badge variant="secondary">Set</Badge>
                          </div>

                          {set.description && (
                            <CardDescription className="line-clamp-2">
                              {set.description}
                            </CardDescription>
                          )}
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                              Oprettet:{" "}
                              {new Date(set.createdAt).toLocaleDateString(
                                "da-DK"
                              )}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span>Studer</span>
                              <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
